<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
               @toggleClick="toggleSideBar"/>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <span class="right-menu-item" style="font-size: 15px;  color: #97a8be"> バージョン: V1.0</span>
        <span class="right-menu-item" style="font-size: 15px;  color: #97a8be">{{this.$store.getters.name}}/{{this.$store.getters.nickName}}</span>
        <!--<search id="header-search" class="right-menu-item"/>-->

<!--        <screenfull id="screenfull" class="right-menu-item hover-effect"/>-->

        <!--<el-tooltip content="レイアウトサイズ" effect="dark" placement="bottom">-->
        <!--  <size-select id="size-select" class="right-menu-item hover-effect"/>-->
        <!--</el-tooltip>-->

      </template>
<!--      <el-dropdown class="right-menu-item hover-effect" trigger="click">-->
<!--        <div class="right-menu-item" style="padding-top: 3px">-->
<!--          <i class="el-icon-bell " style="color:black; font-size: 20px;" ></i>-->
<!--          <span v-show="this.$root.noticeNum > 0"-->
<!--            style="display: inline; font-size: 10px;padding: 0rem 0.5rem;margin-left:-8px;background-color: red;color: #fff;align-items: center;justify-content: center;border-radius: 1rem;">{{this.$root.noticeNum}}</span>-->
<!--        </div>-->
<!--        <el-dropdown-menu slot="dropdown">-->
<!--          <el-dropdown-item style="padding:0" id="dropdowntitle">-->
<!--            <div style="height:50px;">-->
<!--              <span style="font-size:16px; color:#666666;font-weight: 500;line-height:50px;padding:0 20px">メッセージ通知</span>-->
<!--              <span style="float: right;color:#1472C8;line-height:50px;padding:0 20px;cursor:pointer"-->
<!--                    @click="viewAll()">全てを表示</span>-->
<!--            </div>-->
<!--          </el-dropdown-item>-->
<!--          <el-dropdown-item v-for="notification in this.$root.notifications" :key="notification.id"-->
<!--                            @click.native="viewItem(notification.id)">-->
<!--            {{ notification.noticeContent }}-->
<!--          </el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </el-dropdown>-->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>個人情報</el-dropdown-item>
          </router-link>
<!--          <el-dropdown-item @click.native="setting = true">-->
<!--            <span>レイアウト設定</span>-->
<!--          </el-dropdown-item>-->
          <el-dropdown-item divided @click.native="logout">
            <span>ログアウト</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import TopNav from '@/components/TopNav'
  import Hamburger from '@/components/Hamburger'
  import Screenfull from '@/components/Screenfull'
  import SizeSelect from '@/components/SizeSelect'
  import Search from '@/components/HeaderSearch'
  import {listRead} from '@/api/system/noticeBusiness'

  export default {
    components: {
      Breadcrumb,
      TopNav,
      Hamburger,
      Screenfull,
      SizeSelect,
      Search,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'avatar',
        'device'
      ]),
      setting: {
        get() {
          return this.$store.state.settings.showSettings
        },
        set(val) {
          this.$store.dispatch('settings/changeSetting', {
            key: 'showSettings',
            value: val
          })
        }
      },
      topNav: {
        get() {
          return this.$store.state.settings.topNav
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        // listRead().then(response => {
        //   this.$root.notifications = response.data;
        //   this.$root.noticeNum = response.data.length;
        // });
      },
      viewAll() {
        this.$router.push({path: '/tool/noticeBusiness/', query: {twoRouter: true}})
      },
      viewItem(id) {
        const router = "/tool/noticeBusiness/noticeBusinessDetail/index/" + id;
        this.$router.push(router);
      },
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      async logout() {
        this.$confirm('ログアウトしてよろしいですか？', '確認', {
          confirmButtonText: '確定',
          cancelButtonText: 'キャンセル',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .topmenu-container {
      position: absolute;
      left: 50px;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
<style>
  .unread {
    font-weight: bold;
  }
</style>
