<template>
  <div>
    <Panel>
      <div slot="title">{{$t('m.Problems_List')}}</div>
      <div class="custom-table-grid">
        <!-- Table Header as first grid row -->
        <div class="table-row header">
          <div class="cell index-cell">{{$t('m.Number')}}</div>
          <div class="cell difficulty-cell">{{$t('m.Level')}}</div>
          <div class="cell status-cell">{{$t('m.Status')}}</div>
          <div class="cell title-cell">{{$t('m.Title')}}</div>
          <div class="cell id-cell">#</div>
          <template v-if="contestRuleType === 'ACM' || OIContestRealTimePermission">
            <div class="cell total-cell">{{$t('m.Total')}}</div>
            <div class="cell rate-cell">{{$t('m.AC_Rate')}}</div>
          </template>
        </div>
        <!-- Table Body as grid rows -->
        <div
          v-for="(problem, index) in problems"
          :key="problem._id"
          class="table-row"
          @click="goContestProblem(problem)"
        >
          <div class="cell index-cell">{{index + 1}}</div>
          <div class="cell difficulty-cell">
            <Tag v-if="problem.difficulty" :color="getDifficultyColor(problem.difficulty)">
              {{$t('m.' + problem.difficulty)}}
            </Tag>
            <span v-else>-</span>
          </div>
          <div class="cell status-cell">
            <Tag v-if="problem.submission_status"
                 :color="problem.submission_status.color">
              {{$t('m.' + problem.submission_status.name.replace(/ /g, '_'))}}
            </Tag>
            <span v-else class="status-placeholder">-</span>
          </div>
          <div class="cell title-cell" :title="problem.title">{{problem.title}}</div>
          <div class="cell id-cell" :title="problem._id">{{problem._id}}</div>
          <template v-if="contestRuleType === 'ACM' || OIContestRealTimePermission">
            <div class="cell total-cell">{{problem.submission_number}}</div>
            <div class="cell rate-cell">{{getACRate(problem.accepted_number, problem.submission_number)}}</div>
          </template>
        </div>
      </div>
      <div v-if="problemsLoading" class="table-loading-mask">
        <span class="table-loading-text">題目正在載入中...</span>
      </div>
    </Panel>
  </div>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import {ProblemMixin} from '@oj/components/mixins'
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'

  export default {
    name: 'ContestProblemList',
    mixins: [ProblemMixin],
    data () {
      return {
        // 定義狀態優先順序
        statusPriority: {
          'Accepted': 0,
          'Runtime_Error': 1,
          'Time_Limit_Exceeded': 2,
          'Memory_Limit_Exceeded': 3,
          'Partial_Accepted': 4,
          'Wrong_Answer': 5,
          'Compile_Error': 6,
          'System_Error': 7,
          'Pending': 8
        },
        problemsLoading: true
      }
    },
    mounted () {
      this.getContestProblems()
    },
    methods: {
      getContestProblems () {
        this.problemsLoading = true
        this.$store.dispatch('getContestProblems').then(res => {
          if (this.isAuthenticated) {
            // 獲取提交記錄來標註題目狀態
            this.getSubmissionStatus(res.data.data)
          }
          this.problemsLoading = false
        }).catch(() => {
          this.problemsLoading = false
        })
      },
      getSubmissionStatus (problems) {
        const contestID = this.$route.params.contestID
        const cacheKey = `contest_${contestID}_submission_status`
        const cachedData = localStorage.getItem(cacheKey)
        const now = Date.now()
        let cachedStatus = null

        if (cachedData) {
          try {
            const parsed = JSON.parse(cachedData)
            // 檢查緩存是否過期（5分鐘）
            // if (now - parsed.timestamp < 5 * 60 * 1000) {
            // NOTE: 不會過期
            cachedStatus = parsed.data
            // }
          } catch (e) {
            console.error('Failed to parse cached submission status:', e)
          }
        }

        // 先設置所有問題的狀態
        problems.forEach(problem => {
          // 如果有緩存，立即設置緩存的狀態
          if (cachedStatus && cachedStatus[problem._id]) {
            this.$set(problem, 'submission_status', cachedStatus[problem._id])
          } else {
            this.$set(problem, 'submission_status', null)
          }
        })

        // 過濾出需要重新獲取狀態的題目
        const problemsToFetch = problems.filter(problem => {
          // 如果沒有緩存，需要獲取
          if (!cachedStatus || !cachedStatus[problem._id]) {
            return true
          }
          // 如果緩存中的狀態不是 AC，需要重新獲取
          return cachedStatus[problem._id].name !== 'Accepted'
        })

        // 如果有需要重新獲取的題目，則從 API 獲取
        if (problemsToFetch.length > 0) {
          this.fetchSubmissionStatus(problemsToFetch, contestID, cacheKey, cachedStatus)
        }
      },
      fetchSubmissionStatus (problems, contestID, cacheKey, existingCache = {}) {
        const statusMap = {...existingCache}
        let completedRequests = 0
        const totalProblems = problems.length
        const batchSize = 5 // 每批處理的請求數
        const batches = Math.ceil(problems.length / batchSize)

        // 分批處理請求
        for (let i = 0; i < batches; i++) {
          const start = i * batchSize
          const end = Math.min(start + batchSize, problems.length)
          const batchProblems = problems.slice(start, end)

          // 使用 Promise.all 並行處理每批請求
          Promise.all(batchProblems.map(problem => {
            const params = {
              myself: '1',
              problem_id: problem._id,
              contest_id: contestID,
              limit: 100,
              offset: 0
            }

            return api.getContestSubmissionList(0, 100, params).then(res => {
              if (res.data.data.results.length > 0) {
                let bestSubmission = res.data.data.results[0]
                let bestPriority = this.statusPriority[JUDGE_STATUS[bestSubmission.result].name] || 999

                res.data.data.results.forEach(submission => {
                  const currentPriority = this.statusPriority[JUDGE_STATUS[submission.result].name] || 999
                  if (currentPriority < bestPriority) {
                    bestSubmission = submission
                    bestPriority = currentPriority
                  }
                })

                const status = {
                  result: bestSubmission.result,
                  color: JUDGE_STATUS[bestSubmission.result].color,
                  name: JUDGE_STATUS[bestSubmission.result].name
                }
                this.$set(problem, 'submission_status', status)
                statusMap[problem._id] = status
              }
              completedRequests++

              // 當所有請求完成時，更新緩存
              if (completedRequests === totalProblems) {
                localStorage.setItem(cacheKey, JSON.stringify({
                  timestamp: Date.now(),
                  data: statusMap
                }))
              }
            }).catch(() => {
              completedRequests++
            })
          }))
        }
      },
      goContestProblem (row) {
        this.$router.push({
          name: 'contest-problem-details',
          params: {
            contestID: this.$route.params.contestID,
            problemID: row._id
          }
        })
      },
      getDifficultyColor (difficulty) {
        const label = this.$t('m.' + difficulty)
        const colorMap = {
          '必做': '#2e7d32',    // 深綠色
          '進階': '#f57c00',    // 深橙色
          '挑戰': '#c62828'     // 深紅色
        }
        return colorMap[label] || '#546e7a'  // 深灰色作為預設
      }
    },
    computed: {
      ...mapState({
        problems: state => state.contest.contestProblems
      }),
      ...mapGetters(['isAuthenticated', 'contestRuleType', 'OIContestRealTimePermission'])
    }
  }
</script>

<style lang="less" scoped>
.custom-table-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.table-row {
  display: grid;
  grid-template-columns:
    60px    /* index (更窄) */
    70px    /* difficulty */
    140px   /* status */
    minmax(120px, 300px)  /* title, 最小120px，最大300px */
    minmax(120px, 180px)  /* id, 最小120px，最大180px */
    60px    /* total (更窄) */
    80px;   /* rate (更窄) */
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #156DD7;
  transition: background-color 0.1s;
  background-color: #002a57;
  column-gap: 12px;
}
.table-row.header {
  background: #003c7d;
  color: #93c9ff;
  font-weight: 500;
  cursor: default;
}
.cell {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #e6f0ff;
  display: block;
}
.title-cell {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title-cell > * {
  min-width: 0;
}
.id-cell {
  text-align: left;
  justify-content: flex-start;
  min-width: 150px;
}
.table-row:hover:not(.header) {
  background-color: #003c7d;
}
.table-row:last-child {
  border-bottom: none;
}
.table-loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 60, 125, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.table-loading-text {
  color: #93c9ff;
  font-size: 18px;
  letter-spacing: 2px;
}
.status-cell {
  min-width: 60px;
  text-align: center;
}
.status-placeholder {
  display: inline-block;
  min-width: 48px;
  text-align: center;
  color: #93c9ff;
}
</style>
