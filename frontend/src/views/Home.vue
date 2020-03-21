<template>
  <div>
    <v-container>
      <v-row>
        <v-col xs="12">
          <v-card>
            <v-card-title>紹介</v-card-title>
            <v-card-text>紹介文紹介文紹介文紹介文紹介文紹介文紹介文紹介文紹介文紹介文紹介文紹介文</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12">
          <v-card>
            <v-card-title>広告欄</v-card-title>
            <v-card-text>なにかしらの広告をいれたい。</v-card-text>
          </v-card>
        </v-col>
      </v-row>



      <sign-up-session></sign-up-session>

      <instant-oji-session></instant-oji-session>

      <v-row>
        <v-col xs="12" sm="12" md="6">
          <v-card>
            <v-card-title>制作者</v-card-title>
            <v-card-subtitle>理系と文系で作りました</v-card-subtitle>
            <v-card-text justify="left" >
              <v-row align="center">
                <v-col>
                  <v-avatar size="36px">
                    <img src="https://pbs.twimg.com/profile_images/1117388663099252738/jAfqXe15_400x400.jpg">
                  </v-avatar>
                </v-col>
                <v-col>ユーザー名</v-col>
                <v-col>一言コメント</v-col>
              </v-row>
              <v-row align="center">
                <v-col>
                  <v-avatar size="36px">
                    <img src="https://pbs.twimg.com/profile_images/1017346973983100928/fM6fuSr6_400x400.jpg">
                  </v-avatar>
                </v-col>
                <v-col>ユーザー名</v-col>
                <v-col>一言コメント</v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
// @ is an alias to /src
import SignUpSession from '@/components/SignUpSession.vue'
import InstantOjiSession from '@/components/InstantOji.vue'

export default {
  name: 'Home',
  components: {
    InstantOjiSession,
    SignUpSession
  }
}
</script>
