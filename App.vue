<script>
	export default {
		onLaunch: function() {
			wx.cloud.init({
			  env: 'cloud1-0gpacbi01728ba35',  // 在云开发控制台查看
			  traceUser: true
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	
</style>
