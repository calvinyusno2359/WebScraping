const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const greviewscraper = require('./scraper/google-review-scraper');

// NOTE: There is some memory leak issue when doing too many at once...
let jb_urls1 = [
	'https://www.google.com/maps/place/Medi+Aesthetic+-+Aesthetic+Clinic+Johor+Bahru/@1.5318751,103.7900154,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x7dee5772424cfede!8m2!3d1.5318751!4d103.7922041!9m1!1b1',
	'https://www.google.com/maps/place/IDO\'S+Clinic+-+Sutera+Utama/@1.515299,103.6677652,17z/data=!4m7!3m6!1s0x31da73081c2cfd99:0xa74020da056cda42!8m2!3d1.515299!4d103.6699539!9m1!1b1',
	'https://www.google.com/maps/place/Klinik+Foo+%2F+Clinic+Foo/@1.541239,103.8007763,17z/data=!4m7!3m6!1s0x31da6c173d3098e9:0xfbb7b7bf1f2b2aeb!8m2!3d1.541239!4d103.802965!9m1!1b1',
	'https://www.google.com/maps/place/Estee+Clinic+Bukit+Indah/@1.4825101,103.6579412,17z/data=!4m7!3m6!1s0x31da7335fd5f5171:0xcbd0919b9d6386f7!8m2!3d1.4825101!4d103.6601299!9m1!1b1',
	'https://www.google.com/maps/place/Klinik+Harmoni+(Dr+Hon+Aesthetic)/@1.4837134,103.6783722,17z/data=!4m7!3m6!1s0x31da7329bd159257:0x72b32aa2600b69c4!8m2!3d1.4837134!4d103.6805609!9m1!1b1',
	'https://www.google.com/maps/place/Clinic+RX+-+Southkey/@1.4967552,103.7744221,17z/data=!4m7!3m6!1s0x31da6d2a95778e3f:0x3cb13d536a4ab4e2!8m2!3d1.4967552!4d103.7766108!9m1!1b1',
	'https://www.google.com/maps/place/Clinic+Dr.+Ko+(Johor+Bahru)/@1.4844607,103.7731995,17z/data=!4m7!3m6!1s0x31da6cd7d614e979:0x4608e9e7e7f23785!8m2!3d1.4844607!4d103.7753882!9m1!1b1',
	'https://www.google.com/maps/place/DR+WEE+CLINIC+-+AESTHETIC,+ANTI-AGING,+WELLNESS+%26+MEDICAL/@1.4844831,103.7630598,17z/data=!4m7!3m6!1s0x31da6d2fb4305ae3:0xd9080d705a2a25e3!8m2!3d1.4844831!4d103.7652485!9m1!1b1',
	'https://www.google.com/maps/place/Beverly+Wilshire+Medical+Centre/@1.4649619,103.7578513,17z/data=!4m7!3m6!1s0x31da12c44c638649:0x6378b7774facb5b1!8m2!3d1.4649619!4d103.76004!9m1!1b1',
	'https://www.google.com/maps/place/Mediceuticel+Clinic+%7C+Medical+Laser+%26+Aesthetic+Clinic+In+Johor+Bahru,+Johor/@1.461211,103.7620042,17z/data=!4m7!3m6!1s0x31da12dcd1aeb2a7:0x74a06a9604cb274!8m2!3d1.461211!4d103.7641929!9m1!1b1'
	];

let kl_urls1 = [
	'https://www.google.com/maps/place/Nexus+Clinic+Kuala+Lumpur+(Skin+%26+Hair+Aesthetic+Clinic)/@3.1524901,101.7099621,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x24ca69d549f44339!8m2!3d3.1524901!4d101.7121508!9m1!1b1',
	'https://www.google.com/maps/place/Klinik+Hana+Laser+%26+Aesthetic+Clinic+(kl+branch)/@3.1992489,101.7425649,17z/data=!3m1!4b1!4m7!3m6!1s0x0:0x5c5aae2bed34af9e!8m2!3d3.1992489!4d101.7447536!9m1!1b1',
	'https://www.google.com/maps/place/Dr+Lynn+Face+Clinic/@3.198754,101.7132803,17z/data=!4m7!3m6!1s0x31cc38050848544d:0x9f1c96af5f4121e0!8m2!3d3.198754!4d101.715469!9m1!1b1',
	'https://www.google.com/maps/place/RJ+CLINIC/@3.179426,101.6805533,17z/data=!4m7!3m6!1s0x31cc486d3ad0dc83:0x2c43a907e70dfe3d!8m2!3d3.179426!4d101.682742!9m1!1b1',
	'https://www.google.com/maps/place/RJ+CLINIC+(AESTHETIC+@+ATIVO+DAMANSARA)/@3.1955638,101.6146919,17z/data=!4m7!3m6!1s0x31cc4711de2495c1:0x96566d87783cafe4!8m2!3d3.1955638!4d101.6168806!9m1!1b1',
	'https://www.google.com/maps/place/Health+Pathway+Clinic/@3.1543704,101.719106,17z/data=!4m7!3m6!1s0x31cc37cc45d698a1:0xcdf235442f7851d9!8m2!3d3.1543704!4d101.7212947!9m1!1b1',
	'https://www.google.com/maps/place/SIGNATURE+CLINIC/@3.1468966,101.6583941,17z/data=!4m7!3m6!1s0x31cc49a9fec439ab:0xc5585a9b078f27e!8m2!3d3.1468966!4d101.6605828!9m1!1b1',
	'https://www.google.com/maps/place/Lifestyle+Clinic/@3.110191,101.6614762,17z/data=!4m7!3m6!1s0x31cc4a2afc15e349:0x5ac01434382641ef!8m2!3d3.110191!4d101.6636649!9m1!1b1',
	'https://www.google.com/maps/place/EE+CLINIC+-+Premium+Aesthetic,+Laser+%26+Skin+Clinic/@3.0704888,101.6895374,17z/data=!3m1!4b1!4m7!3m6!1s0x31cc4a89a7716431:0x39e306fab98160a3!8m2!3d3.0704888!4d101.6917261!9m1!1b1'
	];

let penang_urls1 = [
	'https://www.google.com/maps/place/Skinworks+Aesthetics+%26+Laser/@5.456445,100.3055963,17z/data=!4m7!3m6!1s0x304ac32129c07ecb:0x563531cf12edb3a1!8m2!3d5.456445!4d100.307785!9m1!1b1',
	'https://www.google.com/maps/place/Clinic+RX+Penang/@5.4382798,100.3057151,17z/data=!4m7!3m6!1s0x304ac3be050ba7eb:0xea9056f0a26949b2!8m2!3d5.4382798!4d100.3079038!9m1!1b1',
	'https://www.google.com/maps/place/O2+Klinik+(Tanjung)/@5.4479567,100.3028652,17z/data=!4m7!3m6!1s0x304ac378c261801b:0x98a04e0a530d0f23!8m2!3d5.4479567!4d100.3050539!9m1!1b1',
	'https://www.google.com/maps/place/O2+Klinik+(Ayer+Itam)/@5.4047302,100.2863017,17z/data=!3m1!4b1!4m5!3m4!1s0x304ac3b5960ec335:0x9c380415be98c6f1!8m2!3d5.4047302!4d100.2884904',
	'https://www.google.com/maps/place/Lim+Skin+Specialist+Clinic/@5.419739,100.3224593,17z/data=!4m7!3m6!1s0x304ac3bd2d4899a5:0xe62f0b259be9847f!8m2!3d5.419739!4d100.324648!9m1!1b1',
	'https://www.google.com/maps/place/AOKLINIK+Penang/@5.396008,100.3009043,17z/data=!4m7!3m6!1s0x304ac22ce084d34f:0x6a44f36ce31bcf11!8m2!3d5.396008!4d100.303093!9m1!1b1',
	'https://www.google.com/maps/place/O2+Klinik+(Jelutong)/@5.3923781,100.3051614,17z/data=!4m7!3m6!1s0x304ac3d5004a9a43:0x741642cca435e21a!8m2!3d5.3923781!4d100.3073501!9m1!1b1',
	'https://www.google.com/maps/place/Estee+Clinic+Penang/@5.3369106,100.3058829,17z/data=!3m1!4b1!4m5!3m4!1s0x304ac0f70bdc7679:0xdddd25d201bac91d!8m2!3d5.3369106!4d100.3080716',
	'https://www.google.com/maps/place/Skin+Society+Advanced+Aesthetic+Centre+and+Facial+Bar/@5.395546,100.3143083,17z/data=!4m7!3m6!1s0x304ac3da0f5fc2db:0xc8860c268ef8faad!8m2!3d5.395546!4d100.316497!9m1!1b1',
	'https://www.google.com/maps/place/A.M+Clinic/@5.3890103,100.3009933,17z/data=!4m7!3m6!1s0x304ac19504375b4d:0x481d0127a342d0ac!8m2!3d5.3890103!4d100.303182!9m1!1b1'
	];

let wellaholic_urls = [
	'https://www.google.com/maps/place/Wellaholic+(Tai+Seng+HQ)/@1.3361512,103.8842078,17z/data=!3m1!4b1!4m5!3m4!1s0x31da171a878682d3:0x6b984d575bdd7b6e!8m2!3d1.3361512!4d103.8863965',
	'https://www.google.com/maps/place/Wellaholic+(Orchard+Outlet)/@1.3055707,103.8279766,17z/data=!3m1!4b1!4m5!3m4!1s0x31da19523875f401:0xc49cb7e8e72574e9!8m2!3d1.3055707!4d103.8301653',
	'https://www.google.com/maps/place/Wellaholic+(Lavender+Outlet)/@1.309722,103.8606713,17z/data=!3m1!4b1!4m5!3m4!1s0x31da19b5af6ffcb9:0x3a83f93894b60a8b!8m2!3d1.309722!4d103.86286',
	'https://www.google.com/maps/place/Wellaholic+(Tanjong+Pagar)/@1.2798954,103.8449751,17z/data=!3m1!4b1!4m5!3m4!1s0x31da1995279cad3d:0x3c79108b8ae8e9c3!8m2!3d1.2798954!4d103.8471638'
	]

// PROBLEM: These links I couldn't scrape for some reason, not a lot of reviews but significant
let kl_urls2 = [
	'https://www.google.com/maps/place/DC+Clinic-+Skin+%26+Medical+Aesthetic+Clinic+in+Kuala+Lumpur/@3.1312521,101.6684164,17z/data=!4m7!3m6!1s0x31cc49f33cd6833b:0xd8e1f08c82b5be59!8m2!3d3.1312521!4d101.6706051!9m1!1b1',
	'https://www.google.com/maps/place/Enhanze+Medical+Aesthetics+%26+Laser+Clinic/@3.126224,101.6415473,17z/data=!4m7!3m6!1s0x31cc49695e894d4d:0xdd00855b10491174!8m2!3d3.126224!4d101.643736!9m1!1b1'
	];

let penang_urls2 = [
	'https://www.google.com/maps/place/Regen+Clinic/@5.4305591,100.2975977,17z/data=!4m7!3m6!1s0x304ac255f58da3a9:0xd539f352cc253b43!8m2!3d5.4305591!4d100.2997864!9m1!1b1'
	];

let folders = ['KL', 'JB', 'Penang', 'Wellaholic'];

let getTitle = (url) => {
	title = url.split('/')[5].split('+').join('_');
	return title
};

let urls = wellaholic_urls; 		// NOTE: select urls list
let folder = folders[3];		// NOTE: select folder accordingly

for (url of urls) {
	let title = getTitle(url);
	greviewscraper.scrape(url).then(result => {
		const csvWriter = createCsvWriter({
		  path: `./raw/${folder}/${title}.csv`,
		  header: [
		    {id: 'fullNames', title: 'fullNames'},
		    {id: 'postDates', title: 'postDates'},
		    {id: 'starRatings', title: 'starRatings'},
		    {id: 'postReviews', title: 'postReviews'},
		    {id: 'totalReviews', title: 'totalReviews'},
		    {id: 'aggregateRating', title: 'aggregateRating'}
		  ]
		});

		csvWriter.writeRecords(result.data)
			.then(()=> console.log(`The ${title}.csv file was written successfully in ${folder} folder.`));
	})
}

