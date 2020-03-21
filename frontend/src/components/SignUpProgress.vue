<template >
  <div class="">
    <v-stepper vertical :value="progress" >

      <v-stepper-step step="1" :complete="progress > 1">Twitterでログイン</v-stepper-step>
      <v-stepper-content step="1">
        <p>本アプリはツイッターでログインしていただくことで利用していただけます。</p>
        <v-btn color="primary" to="/sign_up" v-if="btnExist">Twitter認証</v-btn>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="progress > 2">COTOHA APIに登録</v-stepper-step>
      <v-stepper-content step="2">:complete:"progress > 1"
        <p>COTOHA APIのディベロッパ－登録を行う</p>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="progress > 3">情報を入力</v-stepper-step>
      <v-stepper-content step="3">
        <p></p>
      </v-stepper-content>

    </v-stepper>
  </div>
</template>

<script>
export default {
  name: 'SignUpProgress',
  props: {
    progress: {
      type: Number,
      default: 1
    },
    btnExist: {
      type: Boolean,
      default: true
    }
  },
  data: function(){
    return {
    }
  },
  created: function () {

  },
  methods: {

  }
}
</script>

<style lang="css" scoped>
</style>
