<template>
  <Row type="flex" justify="space-around">
    <Col :span="20" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{$t('m.' + status.statusName.replace(/ /g, "_"))}}</span>
        <div slot="desc" class="content">
          <template v-if="isCE">
            <pre>{{submission.statistic_info.err_info}}</pre>
          </template>
          <template v-else>
            <span>{{$t('m.Time')}}: {{submission.statistic_info.time_cost | submissionTime}}</span>
            <span>{{$t('m.Memory')}}: {{submission.statistic_info.memory_cost | submissionMemory}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: {{submission.username}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 -->
    <Col v-if="submission.info && !isCE" :span="20">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission.info.data"></Table>
    </Col>

    <Col :span="20">
      <Highlight :code="submission.code" :language="submission.language" :border-color="status.color"></Highlight>
    </Col>
    <Col v-if="submission.can_unshare" :span="20">
      <div id="share-btn">
        <Button v-if="submission.shared"
                type="warning" size="large" @click="shareSubmission(false)">
          {{$t('m.UnShare')}}
        </Button>
        <Button v-else
                type="primary" size="large" @click="shareSubmission(true)">
          {{$t('m.Share')}}
        </Button>
      </div>
    </Col>
  </Row>

</template>

<script>
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'

  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        columns: [
          {
            title: this.$i18n.t('m.ID'),
            align: 'center',
            type: 'index'
          },
          {
            title: this.$i18n.t('m.Status'),
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: JUDGE_STATUS[params.row.result].color
                }
              }, this.$i18n.t('m.' + JUDGE_STATUS[params.row.result].name.replace(/ /g, '_')))
            }
          },
          {
            title: this.$i18n.t('m.Memory'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionMemoryFormat(params.row.memory))
            }
          },
          {
            title: this.$i18n.t('m.Time'),
            align: 'center',
            render: (h, params) => {
              return h('span', utils.submissionTimeFormat(params.row.cpu_time))
            }
          }
        ],
        submission: {
          result: '0',
          code: '',
          info: {
            data: []
          },
          statistic_info: {
            time_cost: '',
            memory_cost: ''
          }
        },
        isConcat: false,
        loading: false
      }
    },
    mounted () {
      this.getSubmission()
    },
    methods: {
      getSubmission () {
        this.loading = true
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          if (data.info && data.info.data && !this.isConcat) {
            // score exist means the submission is OI problem submission
            if (data.info.data[0].score !== undefined) {
              this.isConcat = true
              const scoreColumn = {
                title: this.$i18n.t('m.Score'),
                align: 'center',
                key: 'score'
              }
              this.columns.push(scoreColumn)
              this.loadingTable = false
            }
            if (this.isAdminRole) {
              this.isConcat = true
              const adminColumn = [
                {
                  title: this.$i18n.t('m.Real_Time'),
                  align: 'center',
                  render: (h, params) => {
                    return h('span', utils.submissionTimeFormat(params.row.real_time))
                  }
                },
                {
                  title: this.$i18n.t('m.Signal'),
                  align: 'center',
                  key: 'signal'
                }
              ]
              this.columns = this.columns.concat(adminColumn)
            }
          }
          this.submission = data
        }, () => {
          this.loading = false
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.id, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          this.$success(this.$i18n.t('m.Succeeded'))
        }, () => {
        })
      }
    },
    computed: {
      status () {
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === -2
      },
      isAdminRole () {
        return this.$store.getters.isAdminRole
      }
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
      color: #e6f0ff;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      color: #93c9ff;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        color: #e6f0ff;
        background: #002a57;
        padding: 16px;
        border-radius: 4px;
        border: 1px solid #156DD7;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
      color: #e6f0ff;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }

  pre {
    border: none;
    background: none;
  }

  :deep(.ivu-alert) {
    background: #002a57;
    border: 1px solid #156DD7;
    .ivu-alert-icon {
      color: #93c9ff;
    }
    .ivu-alert-message {
      color: #e6f0ff;
    }
    .ivu-alert-desc {
      color: #93c9ff;
    }
  }

  :deep(.ivu-table) {
    background: #002a57;
    color: #e6f0ff;
    
    th {
      background: #003c7d !important;
      color: #93c9ff !important;
      border-bottom: 1px solid #156DD7 !important;
    }
    
    td {
      background: #002a57 !important;
      color: #e6f0ff !important;
      border-bottom: 1px solid #156DD7 !important;
    }

    .ivu-table-stripe {
      td {
        background: #00346B !important;
      }
    }

    .ivu-table-row-hover {
      td {
        background: #003c7d !important;
      }
    }
  }

  :deep(.ivu-btn) {
    &.ivu-btn-primary {
      background: #156DD7;
      border-color: #156DD7;
      &:hover {
        background: #1976d2;
        border-color: #1976d2;
      }
    }
    &.ivu-btn-warning {
      background: #f57c00;
      border-color: #f57c00;
      &:hover {
        background: #ef6c00;
        border-color: #ef6c00;
      }
    }
  }

  :deep(.ivu-tag) {
    border: none;
    color: #e6f0ff;
  }

  // 主要背景
  #main, .ivu-card, .ivu-table-wrapper {
    background: #002a57 !important;
  }

  // 主要內容區塊
  .content, .ivu-table, .ivu-card-body {
    background: transparent !important;
    color: #e6f0ff !important;
  }

  // 分頁
  :deep(.ivu-page) {
    background: none !important;
    .ivu-page-item, .ivu-page-prev, .ivu-page-next, .ivu-page-item-jump-next {
      background: #003c7d !important;
      color: #93c9ff !important;
      border: 1px solid #156DD7 !important;
      &:hover, &.ivu-page-item-active {
        background: #156DD7 !important;
        color: #fff !important;
      }
    }
    .ivu-page-item-active {
      background: #156DD7 !important;
      color: #fff !important;
      border-color: #156DD7 !important;
    }
  }

  // 其他按鈕
  :deep(.ivu-btn-default), :deep(.ivu-btn-ghost), :deep(.ivu-btn) {
    background: #156DD7 !important;
    border-color: #156DD7 !important;
    color: #fff !important;
  }
  :deep(.ivu-btn-default:hover), :deep(.ivu-btn-ghost:hover), :deep(.ivu-btn:hover) {
    background: #1976d2 !important;
    border-color: #1976d2 !important;
    color: #fff !important;
  }

  // 深色主題下的 Alert 樣式
  :deep(.ivu-alert-success) {
    background: #003c7d !important;
    border-color: #2e7d32 !important;
  }
  :deep(.ivu-alert-success) .ivu-alert-icon {
    color: #2e7d32 !important;
  }
  :deep(.ivu-alert-success) .ivu-alert-message,
  :deep(.ivu-alert-success) .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  :deep(.ivu-alert-warning) {
    background: #003c7d !important;
    border-color: #f57c00 !important;
  }
  :deep(.ivu-alert-warning) .ivu-alert-icon {
    color: #f57c00 !important;
  }
  :deep(.ivu-alert-warning) .ivu-alert-message,
  :deep(.ivu-alert-warning) .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  :deep(.ivu-alert-error) {
    background: #003c7d !important;
    border-color: #c62828 !important;
  }
  :deep(.ivu-alert-error) .ivu-alert-icon {
    color: #c62828 !important;
  }
  :deep(.ivu-alert-error) .ivu-alert-message,
  :deep(.ivu-alert-error) .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  :deep(.ivu-alert-info) {
    background: #003c7d !important;
    border-color: #156DD7 !important;
  }
  :deep(.ivu-alert-info) .ivu-alert-icon {
    color: #156DD7 !important;
  }
  :deep(.ivu-alert-info) .ivu-alert-message,
  :deep(.ivu-alert-info) .ivu-alert-desc {
    color: #e6f0ff !important;
  }
</style>
