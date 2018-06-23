<template>
  <div class="header-box">
    <div id="logo" @click="logoClick">
      <img src="@/assets/logo.png" :alt="title">
      <span>{{ title }}</span>
    </div>

    <div id="menus" class="menus" :class="{ active: isActive }">
      <div id="menu" :class="{ active: isActive }" v-if="menuModeShow">
        <el-menu
          id="el-menu"
          :mode="menuMode"
          :default-active="defaultActiveIndex"
          @select="handleSelect"
          :router="true">

          <el-menu-item v-if="loggedin" index="/instances" :route="{ name: 'Instances' }"> Instances </el-menu-item>

        </el-menu>
      </div>

      <div id="menulogin" :class="{ active: isActive }" v-if="menuModeShow">
        <el-menu id="el-menulogin" :mode="menuMode" @select="handleSelect" :router="true">
          <el-menu-item v-if="!loggedin" index="/login"> Login </el-menu-item>

          <el-submenu v-if="loggedin" index="loggedMenu">
            <template slot="title">{{ menuDisplayName }}</template>
            <el-menu-item index="/profile">Profile</el-menu-item>
            <el-menu-item index="/logout">Logout</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </div>

    <div id="toggleButton" @click="toggleClick()">
      <div class="span" id="top" :class="{ active: isActive }"></div>
      <div class="span" id="middle" :class="{ active: isActive }"></div>
      <div class="span" id="bottom" :class="{ active: isActive }"></div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      isActive: false,
      menuMode: this.getMenuMode(document.documentElement.clientWidth),
      menuModeNew: this.getMenuMode(document.documentElement.clientWidth),
      menuModeShow: true
    }
  },
  props: {
    maxMobileStyleSize: {
      type: Number,
      default: 768
    },
    loggedin: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: {}
    },
    defaultActiveIndex: {
      type: String,
      default: '/'
    },
    title: {
      type: String,
      default: 'Vue.js'
    }
  },
  computed: {
    menuDisplayName () {
      if (this.loggedin) {
        if (this.user.attributes && this.user.attributes.given_name) return this.user.attributes.given_name
        if (this.user && this.user.username) return this.user.username
      } else {
        return ''
      }
    },
  },
  watch: {
    menuModeNew (value) {
      this.menuModeShow = false
      this.$set(this, 'menuMode', value) // force menu rerender
      setTimeout(() => { this.menuModeShow = true }, 250) // fix rerender broken submenus
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      if (this.menuMode === 'vertical') this.isActive = !this.isActive
      if (key === '/login') this.removeActiveMenuMark(['el-menu'])
      if (key !== '/login') this.removeActiveMenuMark(['el-menulogin'])
    },
    handleResize (event) {
      // event.target.innerWidth -> renderable browser size
      // event.target.outerWidth -> full browser size
      this.menuModeNew = this.getMenuMode(event.target.innerWidth)
    },
    getMenuMode (size) {
      return (size < this.maxMobileStyleSize) ? 'vertical' : 'horizontal'
    },
    removeActiveMenuMark (menuIdsArr = []) {
      menuIdsArr.forEach(id => {
        Array.from(document.getElementById(`${id}`).getElementsByTagName('li'))
          .forEach(item => item.classList.remove('is-active'))
      })
    },
    toggleClick () {
      this.isActive = !this.isActive
    },
    logoClick () {
      this.removeActiveMenuMark(['el-menu', 'el-menulogin'])
      this.$router.push('/')
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style  lang="scss" scoped>
  @import '@/config/variables.scss';

  .header-box {
    width: 100%;
    border-bottom: solid 1px #e6e6e6;
    display: table;
    min-height: $header-height;
  }

  .el-menu {
    border-right: none;
  }

  .el-menu--horizontal {
    border-bottom: none;
  }

  .el-menu-item {
    padding: 5px 25px;
  }

  .el-submenu {
    padding-top: 5px;
  }

  #menu, #menulogin {
    display: inline-block;
  }

  #menulogin {
    float: right;
  }

  #logo {
    display: inline-block;
    margin-top: 5px;
    float: left;
    z-index: 100;
    max-width: 250px;
    padding: 5px 5px;
    margin-right: 15px;
    cursor: pointer;
  }

  #logo span {
    color: #303133;
    font-size: 20px;
    display:inline-block;
    vertical-align: middle;
  }

  #logo img {
    margin-right: 5px;
    width: 40px;
    height: 40px;
    border: none;
    display:inline-block;
    vertical-align: middle;
  }

  #bellicon {
    display: inline-block;
    position: relative;
    right: 20px;
    top: 14px;
    z-index: 999;
    width: 35px;
    height: 40px;
    cursor: pointer;
    float: right;
  }

  #toggleButton {
    display: inline-block;
    position: absolute;
    right: 20px;
    top: 14px;
    z-index: 999;
    width: 35px;
    height: 40px;
    cursor: pointer;
    float: right;
    transition: all .3s ease-out;
    visibility: hidden;
    opacity: 0;
  }

  #toggleButton .span {
    border-radius: 10px;
    background: $nav-toggle-color;
    transition: all 0.3s ease-out;
    backface-visibility: hidden;
  }

  #top.span.active {
    transform: rotate(45deg) translateX(3px) translateY(5px);
  }

  #middle.span.active {
    opacity: 0;
  }

  #bottom.span.active {
    transform: rotate(-45deg) translateX(8px) translateY(-10px);
  }

  @mixin sm-menu {
    .el-menu .el-menu-item, .el-menu .el-submenu{
      text-align: center;
      display: block;
      height: 100%;
      width: 100%;
      border-top: 1px solid #EAEAEB;
    }
  }

  @media only screen and (max-width: $maxMobileStyleSize) {
    #toggleButton {
      visibility: visible;
      opacity: 1;
      margin-top: 6px;
    }

    #toggleButton .span {
      height: 4px;
      margin: 5px 0;
      transition: all .3s ease-out;
      backface-visibility: visible;
      visibility: visible;
      opacity: 1;
    }

    .el-menu-item, .el-submenu {
      display: none;
      font-weight: bold;
    }

    .menus {
      padding-top: 2px;
      padding-left: 1%;
      padding-right: 1%;
    }

    .menus.active {
      width: 98%;
      z-index: 98;
      background-color: #303133;
      position: relative;
      padding-bottom: 1000px;
      transition: all .5s ease-out;
      display: inline-block;
    }

    #menu.active, #menulogin.active {
      width: 100%;
      opacity: 0.98;
      visibility: visible;
      transition: all .5s ease-out;
      position: relative;
      z-index: 99;

      @include sm-menu;
    }
  }
</style>
