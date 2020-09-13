let greviewscraper = require('./scraper/google-review-scraper');
let converter = require('./util/obj2csv');

let urls = [
	'https://www.google.com/maps/place/Nexus+Clinic+Kuala+Lumpur+(Skin+%26+Hair+Aesthetic+Clinic)/@3.1524901,101.7099621,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x24ca69d549f44339!8m2!3d3.1524901!4d101.7121508!9m1!1b1',
	// 'https://www.google.com/maps/place/Medi+Aesthetic+-+Aesthetic+Clinic+Johor+Bahru/@1.5318751,103.7900154,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x7dee5772424cfede!8m2!3d1.5318751!4d103.7922041!9m1!1b1'
	];

let getTitle = async (url) => {
	title = url.split('/')[5].split('+').join('_');
	return title
}

for (url of urls) {
	greviewscraper.scrape(url).then(async(result) => {
		let title = await getTitle(url);
		converter.convert(result, title);
	})
}

