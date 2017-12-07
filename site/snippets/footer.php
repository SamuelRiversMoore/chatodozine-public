

	<?= // libs
		js(array(
			'assets/libs/jquery/jquery-3.1.1.min.js',
			'assets/libs/sticky/jquery.waypoints.min.js',
			'assets/libs/sticky/sticky.min.js',
			'assets/libs/blazy/blazy.min.js',
			'assets/libs/rangeslider/rangeslider.js',

			'assets/libs/bootstrap/bootstrap.min.js',

			'https://d3js.org/d3.v4.min.js',
			//'assets/libs/d3/d3.v4.min.js',
			'https://www.youtube.com/iframe_api',
			///'assets/libs/youtube_api.js',
			'https://player.vimeo.com/api/player.js',
			//'assets/libs/vimeo_player.js'
		), false);
	?>

	<script type="text/javascript">
		var rootUrl = "<?php echo $site->url(); ?>";
	</script>

	<?= // scipts
		js(array(
			'assets/js/public.min.js', 
		), false);
	?>

	<?php if($user = $site->user()): ?>
		<?= // libs
			js(array(
				'assets/libs/fileupload/vendor/jquery.ui.widget.js',
				'assets/libs/fileupload/jquery.iframe-transport.js',
				'assets/libs/fileupload/jquery.fileupload.js',
				'assets/libs/colorpicker/js/bootstrap-colorpicker.min.js',
				//'https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js',
				'assets/libs/simplemde/simplemde.min.js',
				//'assets/libs/abconnect/abconnect.js',
			), false);
		?>
		<?= // editor
			js(array(
				'assets/js/private.min.js',
			), false);
		?>
	<?php endif ?>


	<!-- Piwik -->
	<script type="text/javascript">
		var _paq = _paq || [];
		/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
		_paq.push(['trackPageView']);
		_paq.push(['enableLinkTracking']);
		(function() {
			var u="//analytics.samuelriversmoore.net/";
			_paq.push(['setTrackerUrl', u+'js/']);
			_paq.push(['setSiteId', '2']);
			var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
			g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'js/'; s.parentNode.insertBefore(g,s);
		})();
	</script>
	<!-- End Piwik Code -->

</body>
</html>