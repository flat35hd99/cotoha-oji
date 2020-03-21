<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>当サービスは安心してご利用いただけるよう細心の注意を払っています</v-card-title>
          <v-card-text>
            <ul>
              <li>利用者様ご自身が当サービスをユーザーページで「有効」にしない限り、登録していただいた情報を利用してTwitterから情報を取得・操作することは<strong>一切ありません</strong></li>
              <li>たとえ「有効」にしたとしても、利用者様ご自身が設定した方法以外で登録していただいた情報を利用してTwitterから情報を取得・操作することは<strong>一切ありません。</strong></li>
              <li>利用者様が当サービスをユーザーページで「無効」にした場合、当サービスは利用者様のアカウントを通して情報を取得・操作することの<strong>一切を取りやめます。</strong></li>
              <li>利用者様が当サービスのアカウントを削除、または、Twitter連携を解除した場合、<strong>利用者様に関わる全ての情報を破棄いたします。</strong>（既にTweetされているものは削除いたしません）</li>
            </ul>
          </v-card-text>
          <v-card-text>
            <v-btn color="primary" @click="twitterSignIn()">Twitterでログイン</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-text>
            <sign-up-progress :progress="1" :btnExist="false"></sign-up-progress>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignUpProgress from '@/components/SignUpProgress.vue'

export default {
  name: 'NewAccount',
  components: {
    SignUpProgress,
  },
  data: function () {

  },
  methods: {
    twitterSignIn: function () {
      const provider = new this.$firebase.auth.TwitterAuthProvider()
      this.$firebase.auth().signInWithRedirect(provider)
    }
  },
  created: function () {
    this.$firebase.auth().getRedirectResult().then((result)=>{
      const token = result.credential.accessToken
      const secret = result.credential.secret
      const user = result.user
      console.log("token: "+token);
      console.log("secret: "+secret)
      console.log("user: "+user);
    }).catch((e)=>{
      const eMsg = e.message
      const credential = e.credential
      console.log("eMsg: "+eMsg);
      console.log("credential: "+credential)
    })
  }
}
</script>

<style lang="css" scoped>
</style>
