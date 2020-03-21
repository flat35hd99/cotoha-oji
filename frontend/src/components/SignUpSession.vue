<template>
  <v-row>
    <v-col xs="12">
      <v-card>
        <v-card-title>登録</v-card-title>
        <v-card-subtitle>Twitterでおじさんになる</v-card-subtitle>
        <v-card-text>登録案内をここに入れる。</v-card-text>
        <sign-up-progress :step="1"></sign-up-progress>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import SignUpProgress from '@/components/SignUpProgress.vue'
export default {
  name: 'SignUpSession',
  components: {
    SignUpProgress,
  }
}
</script>

<style lang="css" scoped>
</style>
