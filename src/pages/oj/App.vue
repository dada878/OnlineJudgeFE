<template>
  <div>
    <NavBar></NavBar>
    <div class="content-app">
      <!-- <transition name="fadeInUp" mode="out-in"> -->
        <router-view></router-view>
      <!-- </transition> -->
      <div class="footer">
        <p v-html="website.website_footer"></p>
        <p>Powered by <a href="https://github.com/QingdaoU/OnlineJudge">OnlineJudge</a>
          <span v-if="version">&nbsp; Version: {{ version }}</span>
        </p>
      </div>
    </div>
    <BackTop></BackTop>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import NavBar from '@oj/components/NavBar.vue'

  export default {
    name: 'app',
    components: {
      NavBar
    },
    data () {
      return {
        version: process.env.VERSION
      }
    },
    created () {
      try {
        document.body.removeChild(document.getElementById('app-loader'))
      } catch (e) {
      }
    },
    mounted () {
      this.getWebsiteConfig()
    },
    methods: {
      ...mapActions(['getWebsiteConfig', 'changeDomTitle'])
    },
    computed: {
      ...mapState(['website'])
    },
    watch: {
      'website' () {
        this.changeDomTitle()
      },
      '$route' () {
        this.changeDomTitle()
      }
    }
  }
</script>

<style lang="less">

  * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    background-color: transparent;
    &:active, &:hover {
      outline-width: 0;
    }
  }


  @media screen and (max-width: 1200px) {
  .content-app {
    margin-top: 160px;
    padding: 0 2%;
  }
}

@media screen and (min-width: 1200px) {
  .content-app {
    margin-top: 80px;
    padding: 0 2%;
  }
}

  .footer {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    font-size: small;
  }

  .fadeInUp-enter-active {
    animation: fadeInUp .8s;
  }

  .ivu-card {
    background: #002a57 !important;
    border: 1px solid #156DD7 !important;
  }

  .ivu-card-head {
    background: #003c7d !important;
    color: #93c9ff !important;
    border-bottom: 1px solid #156DD7 !important;
  }

  .ivu-modal-content {
    background: #002a57 !important;
    border: 1px solid #156DD7 !important;
    color: #e6f0ff !important;
  }

  .ivu-modal-header {
    border-bottom: 1px solid #156DD7 !important;
  }

.ivu-message {
  color: #e6f0ff !important;
}
.ivu-message-notice-content {
  background: #002a57 !important;
  color: #e6f0ff !important;
  border-radius: 6px !important;
  border: 1px solid #156DD7 !important;
}
.ivu-message-custom-content {
  color: #e6f0ff !important;
}
.ivu-message-error {
  color: #ff5252 !important;
}
.ivu-message-success {
  color: #4caf50 !important;
}
.ivu-message-warning {
  color: #ffc107 !important;
}
.ivu-message-info {
  color: #93c9ff !important;
}
.ivu-message .ivu-icon {
  color: inherit !important;
}

  .ivu-input-group-prepend, .ivu-input-group>.ivu-input:last-child{
    background: #002a57 !important;
    background-color: #002a57 !important;
    border: 1px solid #156DD7 !important;
    color: #e6f0ff !important;
  }

  .ivu-card-body {
    background: #002a57 !important;
    color: #e6f0ff !important;
  }

  .panel-title {
    color: #e6f0ff !important;
  }

  .panel-extra {
    color: #93c9ff !important;
  }

  .filter {
    background: none !important;
  }

  .filter li {
    margin-right: 12px !important;
  }

  .ivu-dropdown-rel {
    color: #93c9ff !important;
  }

  .ivu-dropdown-menu {
    background: #003c7d !important;
    border: 1px solid #156DD7 !important;
  }

  .ivu-dropdown-item {
    color: #e6f0ff !important;
  }

  .ivu-dropdown-item:hover {
    background: #156DD7 !important;
    color: #fff !important;
  }

  .ivu-switch {
    background: #003c7d !important;
    border: 1px solid #156DD7 !important;
  }

  .ivu-switch-inner {
    color: #e6f0ff !important;
  }

  .ivu-input-wrapper {
    background: #002a57 !important;
    border: 1px solid #156DD7 !important;
  }

  .ivu-input {
    background: #002a57 !important;
    color: #e6f0ff !important;
    border: none !important;
  }

  .ivu-btn-info {
    background: #156DD7 !important;
    border-color: #156DD7 !important;
    color: #fff !important;
  }

  .ivu-btn-info:hover {
    background: #1976d2 !important;
    border-color: #1976d2 !important;
  }

  .ivu-table {
    background: #002a57 !important;
    color: #e6f0ff !important;
  }

  .ivu-table th {
    background: #003c7d !important;
    color: #93c9ff !important;
    border-bottom: 1px solid #156DD7 !important;
  }

  .ivu-table td {
    background: #002a57 !important;
    color: #e6f0ff !important;
    border-bottom: 1px solid #156DD7 !important;
  }

  .ivu-table-stripe td {
    background: #00346B !important;
  }

  .ivu-table-row-hover td {
    background: #003c7d !important;
  }

  // .ivu-tag {
  //   border: none !important;
  //   color: #e6f0ff !important;
  //   background: unset !important;
  // }

  .ivu-page {
    background: none !important;
  }

  .ivu-page-item, .ivu-page-prev, .ivu-page-next, .ivu-page-item-jump-next {
    background: #003c7d !important;
    color: #93c9ff !important;
    border: 1px solid #156DD7 !important;
  }

  .ivu-page-item:hover, .ivu-page-prev:hover, .ivu-page-next:hover, .ivu-page-item-jump-next:hover,
  .ivu-page-item.ivu-page-item-active {
    background: #156DD7 !important;
    color: #fff !important;
    border-color: #156DD7 !important;
  }

  .ivu-menu-horizontal.ivu-menu-light:after {
    border-bottom: 2px solid #0c54ad !important;
  }

  .ivu-table::before,
  .ivu-table::after {
    background: #003c7d !important;
  }

  .ivu-page-item.ivu-page-item-active {
    background: #156DD7 !important;
    color: #fff !important;
    border-color: #156DD7 !important;
  }

  // === iview loading spinner 深色主題 ===
  .ivu-spin-fix {
    background: rgba(0, 44, 92, 0.7) !important;
    border: none;
  }
  .ivu-spin {
    border: none;
  }
  .ivu-spin-dot {
    background-color: #156DD7 !important;
    border: none;
  }
  .ivu-spin-dot i {
    background-color: #156DD7 !important;
    border: none;
  }
  .ivu-spin-main {
    color: #93c9ff !important;
    border: none;
  }
  .ivu-spin-text {
    color: #93c9ff !important;
    border: none;
  }

  .ivu-spin::after,
  .ivu-spin::before,
  .ivu-spin-nested-loading::before,
  .ivu-spin-nested-loading::after,
  .ivu-spin-fix::before,
  .ivu-spin-fix::after,
  .ivu-spin-large::before,
  .ivu-spin-large::after
  {
    content: none;
    background: rgba(0, 44, 92, 0.7) !important;
  }

  .ivu-spin,
  .ivu-spin-large,
  .ivu-spin-fix,
  .fade-leave,
  .fade-leave-active {
    border: none !important;
  }

  // === iview select/dropdown 深色主題 ===
  .ivu-select,
  .ivu-select-selection {
    background: #00346B !important;
    color: #e6f0ff !important;
    border-radius: 4px !important;
    border: 1px solid #156DD7 !important;
  }
  .ivu-select-selection {
    border: none !important;
    box-shadow: none !important;
  }
  .ivu-select-selected-value {
    color: #e6f0ff !important;
  }
  .ivu-select-dropdown {
    background: #003c7d !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  .ivu-select-item {
    background: #003c7d !important;
    color: #e6f0ff !important;
  }
  .ivu-select-item:hover, .ivu-select-item-selected {
    background: #156DD7 !important;
    color: #fff !important;
  }

  // === iview button 深色主題 ===
  .ivu-btn-warning {
    background: #f57c00 !important;
    border-color: #f57c00 !important;
    color: #fff !important;
  }
  .ivu-btn-warning:hover, .ivu-btn-warning:focus {
    background: #ef6c00 !important;
    border-color: #ef6c00 !important;
    color: #fff !important;
  }
  .ivu-btn-default, .ivu-btn-ghost, .ivu-btn {
    background: #156DD7 !important;
    border-color: #156DD7 !important;
    color: #fff !important;
  }
  .ivu-btn-default:hover, .ivu-btn-ghost:hover, .ivu-btn:hover {
    background: #044d9b !important;
    border-color: #1976d2 !important;
    color: #fff !important;
  }

  .mini-container.ivu-upload > div {
    background: #002a57 !important;
    border: 1px solid #156DD7 !important;
    color: #e6f0ff !important;
  }

  .ivu-form-item-label {
    color: #e6f0ff !important;
  }

  .ivu-menu-item {
    color: #c1cee3 !important;
  }

  // === NavBar active item 更低調 ===
  .ivu-menu-item-active,
  .ivu-menu-item-selected {
    background: #084078 !important;
    color: #e6f0ff !important;
    font-weight: 500 !important;
    border-bottom: 2px solid #93c9ff !important;
    transition: background 0.2s;
  }

  // === iview alert 深色主題 ===
  .ivu-alert-success {
    background: #003602 !important;
    border-color: #2e7d32 !important;
    border-width: 2px !important;
  }
  .ivu-alert-success .ivu-alert-icon {
    color: #2e7d32 !important;
  }
  .ivu-alert-success .ivu-alert-message,
  .ivu-alert-success .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  .ivu-alert-warning {
    background: #603000 !important;
    border-color: #f57c00 !important;
    border-width: 2px !important;
    pre {
      background: #391c00 !important;
      color: #e6f0ff !important;
      border: 1px solid #934900 !important;
    }
  }
  .ivu-alert-warning .ivu-alert-icon {
    color: #f57c00 !important;
  }
  .ivu-alert-warning .ivu-alert-message,
  .ivu-alert-warning .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  .ivu-alert-error {
    background: #540707 !important;
    border-color: #c62828 !important;
    border-width: 2px !important;
  }
  .ivu-alert-error .ivu-alert-icon {
    color: #c62828 !important;
  }
  .ivu-alert-error .ivu-alert-message,
  .ivu-alert-error .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  .ivu-alert-info {
    background: #003e44 !important;
    border-color: #00757d !important;
    border-width: 2px !important;
  }
  .ivu-alert-info .ivu-alert-icon {
    color: #00757d !important;
  }
  .ivu-alert-info .ivu-alert-message,
  .ivu-alert-info .ivu-alert-desc {
    color: #e6f0ff !important;
  }

  .markdown-body pre {
      background: #003771 !important;
      border: 1px solid #156DD7 !important;
      border-radius: 4px !important;
    }

    .ivu-dropdown-item.ivu-dropdown-item-divided::before {
      background: #003c7d !important;
    }

    .ivu-dropdown-item.ivu-dropdown-item-divided {
      border-top: 1px solid #156DD7 !important;
    }

</style>
