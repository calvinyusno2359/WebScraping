const puppeteer = require('puppeteer');

let scrape = async(url) => {
	const browser = await puppeteer.launch({args: ['--no-sandbox', '--disabled-setuid-sandbox']});
	const reviewPage = await browser.newPage();

	await reviewPage.goto(url);
	await reviewPage.waitForSelector('.widget-pane-visible')

	const metadata = await reviewPage.evaluate(() => {
		let aggregateRating = document.querySelector('.gm2-display-2').innerText;
		let totalReviews = document.querySelector('.gm2-caption').innerText;

		return {
			aggregateRating,
			totalReviews,
		}
	})

	const reviews = await reviewPage.evaluate(() => {
		let fullName = document.querySelector('.section-review-title').innerText;
		let postDate = document.querySelector('.section-review-publish-date').innerText;
		let starRating = document.querySelector('.section-review-stars').getAttribute('aria-label');
		let postReview = document.querySelector('.section-review-text').innerText;

		return {
			fullName,
			postDate,
			starRating,
			postReview
		}
	});

	browser.close();

	return {
		metadata,
		reviews
	};
};

// let url = 'https://www.google.com/maps/place/Nexus+Clinic+Kuala+Lumpur+(Skin+%26+Hair+Aesthetic+Clinic)/@3.1524901,101.7099621,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x24ca69d549f44339!8m2!3d3.1524901!4d101.7121508!9m1!1b1'

// scrape(url).then(result => {
// 	console.log(result);
// })

exports.scrape = scrape;
