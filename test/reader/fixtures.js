'use strict';

var fixtures = {
	'BOOK': {
		'BOOKMARK_CHAPTER': 4,
		'BOOKMARK': {
			'CFI': 'epubcfi(/6/10!/4/2[semiprologue]/2/4/2/2/1:0)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': 'Banana',
			'chapter': 'SemiPrologue'
		},
		'BOOKMARK_2_CHAPTER': 5,
		'BOOKMARK_2': {
			'CFI': 'epubcfi(/6/12!/4/2[chapter-1]/2/4/2/2/1:0)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': '',
			'chapter': 'Chapter 1'
		},
		'BOOKMARK_3_CHAPTER': 5,
		'BOOKMARK_3': {
			'CFI': 'epubcfi(/6/12!/4/2[chapter-1]/2/12/2/1:0)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': '',
			'chapter': 'Chapter 1'
		},
		'BOOKMARK_4_CHAPTER': 5,
		'BOOKMARK_4': {
			'CFI': 'epubcfi(/6/12!/4/2[chapter-1]/2/28/1:27)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': '',
			'chapter': 'Chapter 1'
		},
		'BOOKMARK_5_CHAPTER': 5,
		'BOOKMARK_5': {
			'CFI': 'epubcfi(/6/12!/4/2[chapter-1]/2/30/1:0)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': '',
			'chapter': 'Chapter 1'
		},
		'BOOKMARK_6_CHAPTER': 5,
		'BOOKMARK_6': {
			'CFI': 'epubcfi(/6/12!/4/2[chapter-1]/2/30/1:5)',
			'href': 'OEBPS/SemiPrologue.xhtml',
			'preview': '',
			'chapter': 'Chapter 1'
		},
		'DATA_RAW': {
			'version': '1.2',
			'title': 'Does the Noise in My Head Bother You?: The Autobiography',
			'sample': true,
			'opfPath': 'OEBPS/content.opf',
			'toc': [
				{
					'label': 'Cover',
					'href': 'OEBPS/Cover.xhtml',
					'active': true
				},
				{
					'label': 'Title Page',
					'href': 'OEBPS/Title%20Page.xhtml',
					'active': true
				},
				{
					'label': 'Dedication',
					'href': 'OEBPS/Dedication.xhtml',
					'active': true
				},
				{
					'label': 'Contents',
					'href': 'OEBPS/Contents.xhtml',
					'active': true
				},
				{
					'label': 'SemiPrologue',
					'href': 'OEBPS/SemiPrologue.xhtml',
					'active': true
				},
				{
					'label': 'Chapter 1',
					'href': 'OEBPS/Chapter%201.xhtml',
					'active': true
				},
				{
					'label': 'Chapter 2',
					'href': 'OEBPS/Chapter%202.xhtml',
					'active': true
				},
				{
					'label': 'Chapter 3',
					'href': 'OEBPS/Chapter%203.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 4',
					'href': 'OEBPS/Chapter%204.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 5',
					'href': 'OEBPS/Chapter%205.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 6',
					'href': 'OEBPS/Chapter%206.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 7',
					'href': 'OEBPS/Chapter%207.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 8',
					'href': 'OEBPS/Chapter%208.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 9',
					'href': 'OEBPS/Chapter%209.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 10',
					'href': 'OEBPS/Chapter%2010.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 11',
					'href': 'OEBPS/Chapter%2011.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 12',
					'href': 'OEBPS/Chapter%2012.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 13',
					'href': 'OEBPS/Chapter%2013.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 13.5',
					'href': 'OEBPS/Chapter%2013.5.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 14',
					'href': 'OEBPS/Chapter%2014.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 15',
					'href': 'OEBPS/Chapter%2015.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 16',
					'href': 'OEBPS/Chapter%2016.xhtml',
					'active': false
				},
				{
					'label': 'Chapter 17',
					'href': 'OEBPS/Chapter%2017.xhtml',
					'active': false
				},
				{
					'label': 'Acknowledgments',
					'href': 'OEBPS/Acknowledgments.xhtml',
					'active': false
				},
				{
					'label': 'Index',
					'href': 'OEBPS/Index.xhtml',
					'active': false
				},
				{
					'label': 'Video: Like Hypnosis',
					'href': 'OEBPS/featured1.xhtml',
					'active': false
				},
				{
					'label': 'Video: Fame',
					'href': 'OEBPS/featured2.xhtml',
					'active': false
				},
				{
					'label': 'Video: Let It All Hang Out',
					'href': 'OEBPS/featured3.xhtml',
					'active': false
				},
				{
					'label': 'Video: Filling in the Blanks',
					'href': 'OEBPS/featured4.xhtml',
					'active': false
				},
				{
					'label': 'Video: The Key',
					'href': 'OEBPS/featured5.xhtml',
					'active': false
				},
				{
					'label': 'Video: Dream On',
					'href': 'OEBPS/featured6.xhtml',
					'active': false
				},
				{
					'label': 'Video: The Process Never Stops',
					'href': 'OEBPS/featured7.xhtml',
					'active': false
				},
				{
					'label': 'Video: Flaunt It if You Got It',
					'href': 'OEBPS/featured8.xhtml',
					'active': false
				},
				{
					'label': 'Video: Moth Man',
					'href': 'OEBPS/featured9.xhtml',
					'active': false
				},
				{
					'label': 'Audio: Looking in the Mirror',
					'href': 'OEBPS/featured10.xhtml',
					'active': false
				},
				{
					'label': 'About the Authors',
					'href': 'OEBPS/About%20the%20Author.xhtml',
					'active': false
				},
				{
					'label': 'Credits',
					'href': 'OEBPS/Credits.xhtml',
					'active': false
				},
				{
					'label': 'Copyright',
					'href': 'OEBPS/Copyright.xhtml',
					'active': false
				},
				{
					'label': 'Permissions',
					'href': 'OEBPS/Permissions.xhtml',
					'active': false
				},
				{
					'label': 'About the Publisher',
					'href': 'OEBPS/About%20the%20Publisher.xhtml',
					'active': false
				}
			],
			'spine': [
				{
					'href': 'OEBPS/Cover.xhtml',
					'linear': true,
					'wordCount': 0,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/Title%20Page.xhtml',
					'linear': true,
					'wordCount': 0,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/Dedication.xhtml',
					'linear': true,
					'wordCount': 13,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/Contents.xhtml',
					'linear': true,
					'wordCount': 210,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/SemiPrologue.xhtml',
					'linear': true,
					'wordCount': 703,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/Chapter%201.xhtml',
					'linear': true,
					'wordCount': 12040,
					'mediaType': 'application/xhtml+xml'
				},
				{
					'href': 'OEBPS/Chapter%202.xhtml',
					'linear': true,
					'wordCount': 1102,
					'mediaType': 'application/xhtml+xml'
				}
			]
		},
		'DATA': {
			'content_path_prefix': 'OEBPS',
			'opf': '<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" unique-identifier="bookid" version="2.0"><metadata><meta name="generator" content="Adobe InDesign"/><dc:title>Does the Noise in My Head Bother You?</dc:title><dc:creator>Steven Tyler</dc:creator><dc:subject/><dc:description/><dc:publisher>HarperCollins Publishers</dc:publisher><dc:date>2011-05-01</dc:date><dc:source/><dc:relation/><dc:coverage/><dc:rights/><dc:identifier id="bookid">urn:uuid:9780061959394</dc:identifier><dc:language>en</dc:language><meta name="cover" content="cover-jpg" /></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="Cover.xhtml" media-type="application/xhtml+xml"/><item id="title-page" href="Title%20Page.xhtml" media-type="application/xhtml+xml"/><item id="dedication" href="Dedication.xhtml" media-type="application/xhtml+xml"/><item id="contents" href="Contents.xhtml" media-type="application/xhtml+xml"/><item id="semiprologue" href="SemiPrologue.xhtml" media-type="application/xhtml+xml"/><item id="chapter-1" href="Chapter%201.xhtml" media-type="application/xhtml+xml"/><item id="chapter-2" href="Chapter%202.xhtml" media-type="application/xhtml+xml"/><item id="chapter-3" href="Chapter%203.xhtml" media-type="application/xhtml+xml"/><item id="chapter-4" href="Chapter%204.xhtml" media-type="application/xhtml+xml"/><item id="chapter-5" href="Chapter%205.xhtml" media-type="application/xhtml+xml"/><item id="chapter-6" href="Chapter%206.xhtml" media-type="application/xhtml+xml"/><item id="chapter-7" href="Chapter%207.xhtml" media-type="application/xhtml+xml"/><item id="chapter-8" href="Chapter%208.xhtml" media-type="application/xhtml+xml"/><item id="chapter-9" href="Chapter%209.xhtml" media-type="application/xhtml+xml"/><item id="chapter-10" href="Chapter%2010.xhtml" media-type="application/xhtml+xml"/><item id="chapter-11" href="Chapter%2011.xhtml" media-type="application/xhtml+xml"/><item id="chapter-12" href="Chapter%2012.xhtml" media-type="application/xhtml+xml"/><item id="chapter-13" href="Chapter%2013.xhtml" media-type="application/xhtml+xml"/><item id="chapter-13-5" href="Chapter%2013.5.xhtml" media-type="application/xhtml+xml"/><item id="chapter-14" href="Chapter%2014.xhtml" media-type="application/xhtml+xml"/><item id="chapter-15" href="Chapter%2015.xhtml" media-type="application/xhtml+xml"/><item id="chapter-16" href="Chapter%2016.xhtml" media-type="application/xhtml+xml"/><item id="chapter-17" href="Chapter%2017.xhtml" media-type="application/xhtml+xml"/><item id="acknowledgments" href="Acknowledgments.xhtml" media-type="application/xhtml+xml"/><item id="index" href="Index.xhtml" media-type="application/xhtml+xml"/><item id="about-the-author" href="About%20the%20Author.xhtml" media-type="application/xhtml+xml"/><item id="credits" href="Credits.xhtml" media-type="application/xhtml+xml"/><item id="copyright" href="Copyright.xhtml" media-type="application/xhtml+xml"/><item id="permissions" href="Permissions.xhtml" media-type="application/xhtml+xml"/><item id="about-the-publisher" href="About%20the%20Publisher.xhtml" media-type="application/xhtml+xml"/><item id="x038-fmt-jpeg" href="images/038_fmt.jpeg" media-type="image/jpeg"/><item id="x039-fmt-gif" href="images/039_fmt.gif" media-type="image/gif"/><item id="x051-fmt-jpeg" href="images/051_fmt.jpeg" media-type="image/jpeg"/><item id="x052-fmt-jpeg" href="images/052_fmt.jpeg" media-type="image/jpeg"/><item id="x054-fmt-jpeg" href="images/054_fmt.jpeg" media-type="image/jpeg"/><item id="x055-fmt-jpeg" href="images/055_fmt.jpeg" media-type="image/jpeg"/><item id="x057-fmt-jpeg" href="images/057_fmt.jpeg" media-type="image/jpeg"/><item id="x062-fmt-jpeg" href="images/062_fmt.jpeg" media-type="image/jpeg"/><item id="x069-fmt-jpeg" href="images/069_fmt.jpeg" media-type="image/jpeg"/><item id="x10-fmt-jpeg" href="images/10_fmt.jpeg" media-type="image/jpeg"/><item id="x11-fmt-jpeg" href="images/11_fmt.jpeg" media-type="image/jpeg"/><item id="x12-fmt-jpeg" href="images/12_fmt.jpeg" media-type="image/jpeg"/><item id="x13-fmt-jpeg" href="images/13_fmt.jpeg" media-type="image/jpeg"/><item id="x14-fmt-jpeg" href="images/14_fmt.jpeg" media-type="image/jpeg"/><item id="x15-fmt-jpeg" href="images/15_fmt.jpeg" media-type="image/jpeg"/><item id="x16-fmt-jpeg" href="images/16_fmt.jpeg" media-type="image/jpeg"/><item id="x17-fmt-gif" href="images/17_fmt.gif" media-type="image/gif"/><item id="x18-fmt-jpeg" href="images/18_fmt.jpeg" media-type="image/jpeg"/><item id="x19-fmt-jpeg" href="images/19_fmt.jpeg" media-type="image/jpeg"/><item id="x1-fmt-jpeg" href="images/1_fmt.jpeg" media-type="image/jpeg"/><item id="x20-fmt-jpeg" href="images/20_fmt.jpeg" media-type="image/jpeg"/><item id="x21-fmt-jpeg" href="images/21_fmt.jpeg" media-type="image/jpeg"/><item id="x22-fmt-gif" href="images/22_fmt.gif" media-type="image/gif"/><item id="x23-fmt-jpeg" href="images/23_fmt.jpeg" media-type="image/jpeg"/><item id="x24-fmt-jpeg" href="images/24_fmt.jpeg" media-type="image/jpeg"/><item id="x25-fmt-gif" href="images/25_fmt.jpeg" media-type="image/jpeg"/><item id="x27-fmt-jpeg" href="images/27_fmt.jpeg" media-type="image/jpeg"/><item id="x28-fmt-jpeg" href="images/28_fmt.jpeg" media-type="image/jpeg"/><item id="x29-fmt-jpeg" href="images/29_fmt.jpeg" media-type="image/jpeg"/><item id="x2-fmt-jpeg" href="images/2_fmt.jpeg" media-type="image/jpeg"/><item id="x31-fmt-gif" href="images/31_fmt.jpeg" media-type="image/jpeg"/><item id="x33-fmt-jpeg" href="images/33_fmt.jpeg" media-type="image/jpeg"/><item id="x34-fmt-jpeg" href="images/34_fmt.jpeg" media-type="image/jpeg"/><item id="x35a-st39-fmt-jpeg" href="images/35a_ST39_fmt.jpeg" media-type="image/jpeg"/><item id="x36-fmt-jpeg" href="images/36_fmt.jpeg" media-type="image/jpeg"/><item id="x36a-st14-fmt-jpeg" href="images/36a_ST14_fmt.jpeg" media-type="image/jpeg"/><item id="x36b-st-book-photo-37-fmt-jpeg" href="images/36b_ST%20book%20photo%2037_fmt.jpeg" media-type="image/jpeg"/><item id="x36c-for-lucy-st36-fmt-jpeg" href="images/36c_FOR%20LUCY%20ST36_fmt.jpeg" media-type="image/jpeg"/><item id="x37-fmt-jpeg" href="images/37_fmt.jpeg" media-type="image/jpeg"/><item id="x3-fmt-jpeg" href="images/3_fmt.jpeg" media-type="image/jpeg"/><item id="x40-1-fmt-jpeg" href="images/40-1_fmt.jpeg" media-type="image/jpeg"/><item id="x41-fmt-jpeg" href="images/41_fmt.jpeg" media-type="image/jpeg"/><item id="x42-fmt-jpeg" href="images/42_fmt.jpeg" media-type="image/jpeg"/><item id="x42a-fmt-gif" href="images/42a_fmt.gif" media-type="image/gif"/><item id="x42b-fmt-jpeg" href="images/42b_fmt.jpeg" media-type="image/jpeg"/><item id="x44-fmt-gif" href="images/44_fmt.gif" media-type="image/gif"/><item id="x46-fmt-jpeg" href="images/46_fmt.jpeg" media-type="image/jpeg"/><item id="x47-fmt-jpeg" href="images/47_fmt.jpeg" media-type="image/jpeg"/><item id="x48-fmt-jpeg" href="images/48_fmt.jpeg" media-type="image/jpeg"/><item id="x49-fmt-jpeg" href="images/49_fmt.jpeg" media-type="image/jpeg"/><item id="x4-fmt-jpeg" href="images/4_fmt.jpeg" media-type="image/jpeg"/><item id="x50-fmt-jpeg" href="images/50_fmt.jpeg" media-type="image/jpeg"/><item id="x53-fmt-jpeg" href="images/53_fmt.jpeg" media-type="image/jpeg"/><item id="x56-fmt-jpeg" href="images/56_fmt.jpeg" media-type="image/jpeg"/><item id="x59-fmt-jpeg" href="images/59_fmt.jpeg" media-type="image/jpeg"/><item id="x5-fmt-jpeg" href="images/5_fmt.jpeg" media-type="image/jpeg"/><item id="x60-fmt-jpeg" href="images/60_fmt.jpeg" media-type="image/jpeg"/><item id="x60a-fmt-jpeg" href="images/60a_fmt.jpeg" media-type="image/jpeg"/><item id="x61r-fmt-jpeg" href="images/61R_fmt.jpeg" media-type="image/jpeg"/><item id="x64-fmt-gif" href="images/64_fmt.gif" media-type="image/gif"/><item id="x65-fmt-jpeg" href="images/65_fmt.jpeg" media-type="image/jpeg"/><item id="x65a-fmt-jpeg" href="images/65a_fmt.jpeg" media-type="image/jpeg"/><item id="x66-67-fmt-jpeg" href="images/66_67_fmt.jpeg" media-type="image/jpeg"/><item id="x68-fmt-jpeg" href="images/68_fmt.jpeg" media-type="image/jpeg"/><item id="x6-fmt-jpeg" href="images/6_fmt.jpeg" media-type="image/jpeg"/><item id="x70-fmt-jpeg" href="images/70_fmt.jpeg" media-type="image/jpeg"/><item id="x71-fmt-jpeg" href="images/71_fmt.jpeg" media-type="image/jpeg"/><item id="x72-fmt-jpeg" href="images/72_fmt.jpeg" media-type="image/jpeg"/><item id="x7-fmt-jpeg" href="images/7_fmt.jpeg" media-type="image/jpeg"/><item id="x8-fmt-jpeg" href="images/8_fmt.jpeg" media-type="image/jpeg"/><item id="x9-fmt-jpeg" href="images/9_fmt.jpeg" media-type="image/jpeg"/><item id="title-fmt-jpeg" href="images/title_fmt.jpeg" media-type="image/jpeg"/><item id="css" href="template.css" media-type="text/css"/><item id="css1" href="template1.css" media-type="text/css"/><item id="cover-png" href="images/cover.png" media-type="image/png"/><item id="cover-jpg" href="images/cover.jpg" media-type="image/jpeg"/><item id="feat1" href="featured1.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat2" href="featured2.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat3" href="featured3.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat4" href="featured4.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat5" href="featured5.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat6" href="featured6.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat7" href="featured7.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat8" href="featured8.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat9" href="featured9.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="feat10" href="featured10.xhtml" media-type="application/xhtml+xml"/>\t\t<item id="poster1" href="images/poster1.png" media-type="image/png"/>\t\t<item id="poster2" href="images/poster2.png" media-type="image/png"/>\t\t<item id="poster3" href="images/poster3.png" media-type="image/png"/>\t\t<item id="poster4" href="images/poster4.png" media-type="image/png"/>\t\t<item id="poster5" href="images/poster5.png" media-type="image/png"/>\t\t<item id="poster6" href="images/poster6.png" media-type="image/png"/>\t\t<item id="poster7" href="images/poster7.png" media-type="image/png"/>\t\t<item id="poster8" href="images/poster8.png" media-type="image/png"/>\t\t<item id="poster9" href="images/poster9.png" media-type="image/png"/>\t\t<item id="poster10" href="images/poster10.png" media-type="image/png"/>\t\t<item id="vid1" href="video/vid1.m4v" media-type="video/m4v"/>\t\t<item id="vid2" href="video/vid2.m4v" media-type="video/m4v"/>\t\t<item id="vid3" href="video/vid3.m4v" media-type="video/m4v"/>\t\t<item id="vid4" href="video/vid4.m4v" media-type="video/m4v"/>\t\t<item id="vid5" href="video/vid5.m4v" media-type="video/m4v"/>\t\t<item id="vid6" href="video/vid6.m4v" media-type="video/m4v"/>\t\t<item id="vid7" href="video/vid7.m4v" media-type="video/m4v"/>\t\t<item id="vid8" href="video/vid8.m4v" media-type="video/m4v"/>\t\t<item id="vid9" href="video/vid9.m4v" media-type="video/m4v"/>\t\t<item id="aud1" href="video/aud1.m4a" media-type="audio/m4a"/>\t\t\t\t<item id="slide1" href="images/slide1.jpg" media-type="image/jpeg"/>\t\t<item id="slide2" href="images/slide2.jpg" media-type="image/jpeg"/>\t\t<item id="slide3" href="images/slide3.jpg" media-type="image/jpeg"/>\t\t<item id="slide4" href="images/slide4.jpg" media-type="image/jpeg"/>\t\t<item id="slide5" href="images/slide5.jpg" media-type="image/jpeg"/>\t\t\t\t\t\t\t\t\t\t    </manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title-page"/><itemref idref="dedication"/><itemref idref="contents"/><itemref idref="semiprologue"/><itemref idref="chapter-1"/><itemref idref="chapter-2"/><itemref idref="chapter-3"/><itemref idref="chapter-4"/><itemref idref="chapter-5"/><itemref idref="chapter-6"/><itemref idref="chapter-7"/><itemref idref="chapter-8"/><itemref idref="chapter-9"/><itemref idref="chapter-10"/><itemref idref="chapter-11"/><itemref idref="chapter-12"/><itemref idref="chapter-13"/><itemref idref="chapter-13-5"/><itemref idref="chapter-14"/><itemref idref="chapter-15"/><itemref idref="chapter-16"/><itemref idref="chapter-17"/><itemref idref="acknowledgments"/><itemref idref="index"/><itemref idref="feat1"/><itemref idref="feat2"/><itemref idref="feat3"/><itemref idref="feat4"/><itemref idref="feat5"/><itemref idref="feat6"/><itemref idref="feat7"/><itemref idref="feat8"/><itemref idref="feat9"/><itemref idref="feat10"/><itemref idref="about-the-author"/><itemref idref="credits"/><itemref idref="copyright"/><itemref idref="permissions"/><itemref idref="about-the-publisher"/></spine><guide><reference type="cover-page" title="Cover" href="Cover.xhtml"/><reference type="copyright-page" title="Copyright" href="Copyright.xhtml"/><reference type="TOC" title="Contents" href="Contents.xhtml"/></guide></package>'
		}
	},
	'BOOK_2': {
		'BOOKMARK_CHAPTER': 2,
		'BOOKMARK': {
			'CFI': 'epubcfi(/6/6!/4/2/5:0)',
			'href': 'OEBPS/html/introduction.html#int02',
			'preview': 'Banana',
			'chapter': 'SELECT BIBLIOGRAPHY'
		},
		'BOOKMARK_2_CHAPTER': 3,
		'BOOKMARK_2': {
			'CFI': 'epubcfi(/6/8!/4/2/5:0)',
			'href': 'OEBPS/html/book01.html#bk01ch02',
			'preview': 'Banana',
			'chapter': 'CHAPTER 2'
		},
		'DATA_RAW': {
			'version': '1.3',
			'title': 'A History of My Times',
			'sample': true,
			'startCfi': 'epubcfi(/6/8!/4/2/2[page_51])',
			'opfPath': 'OEBPS/html/9780140441758.opf',
			'toc': [
				{
					'itemId': 'cover',
					'label': 'Cover',
					'href': 'OEBPS/html/cover.html',
					'active': true
				},
				{
					'itemId': 'frontmatter',
					'label': 'Title Page',
					'href': 'OEBPS/html/frontmatter.html#title',
					'active': true
				},
				{
					'itemId': 'frontmatter',
					'label': 'Copyright Page',
					'href': 'OEBPS/html/frontmatter.html#copy',
					'active': true
				},
				{
					'itemId': 'frontmatter',
					'label': 'CONTENTS',
					'href': 'OEBPS/html/frontmatter.html#toc01',
					'active': true
				},
				{
					'itemId': 'introduction',
					'label': 'INTRODUCTION',
					'href': 'OEBPS/html/introduction.html#int01',
					'active': true
				},
				{
					'itemId': 'introduction',
					'label': 'SELECT BIBLIOGRAPHY',
					'href': 'OEBPS/html/introduction.html#int02',
					'active': false
				},
				{
					'itemId': 'introduction',
					'label': 'A NOTE ON THE NOTES',
					'href': 'OEBPS/html/introduction.html#notes',
					'active': false
				},
				{
					'itemId': 'book01',
					'label': 'A History of My Times',
					'href': 'OEBPS/html/book01.html#bk01',
					'active': false,
					'children': [
						{
							'itemId': 'book01',
							'label': 'BOOK ONE',
							'href': 'OEBPS/html/book01.html#page_51',
							'active': false,
							'children': [
								{
									'itemId': 'book01',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book01.html#bk01ch01',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book01.html#bk01ch02',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book01.html#bk01ch03',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book01.html#bk01ch04',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 5',
									'href': 'OEBPS/html/book01.html#bk01ch05',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 6',
									'href': 'OEBPS/html/book01.html#bk01ch06',
									'active': false
								},
								{
									'itemId': 'book01',
									'label': 'CHAPTER 7',
									'href': 'OEBPS/html/book01.html#bk01ch07',
									'active': false
								}
							]
						},
						{
							'itemId': 'book02',
							'label': 'BOOK TWO',
							'href': 'OEBPS/html/book02.html#bk02',
							'active': false,
							'children': [
								{
									'itemId': 'book02',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book02.html#bk02ch01',
									'active': false
								},
								{
									'itemId': 'book02',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book02.html#bk02ch02',
									'active': false
								},
								{
									'itemId': 'book02',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book02.html#bk02ch03',
									'active': false
								},
								{
									'itemId': 'book02',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book02.html#bk02ch04',
									'active': false
								}
							]
						},
						{
							'itemId': 'book03',
							'label': 'BOOK THREE',
							'href': 'OEBPS/html/book03.html#bk03',
							'active': false,
							'children': [
								{
									'itemId': 'book03',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book03.html#bk03ch01',
									'active': false
								},
								{
									'itemId': 'book03',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book03.html#bk03ch02',
									'active': false
								},
								{
									'itemId': 'book03',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book03.html#bk03ch03',
									'active': false
								},
								{
									'itemId': 'book03',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book03.html#bk03ch04',
									'active': false
								},
								{
									'itemId': 'book03',
									'label': 'CHAPTER 5',
									'href': 'OEBPS/html/book03.html#bk03ch05',
									'active': false
								}
							]
						},
						{
							'itemId': 'book04',
							'label': 'BOOK FOUR',
							'href': 'OEBPS/html/book04.html#bk04',
							'active': false,
							'children': [
								{
									'itemId': 'book04',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book04.html#bk04ch01',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book04.html#bk04ch02',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book04.html#bk04ch03',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book04.html#bk04ch04',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 5',
									'href': 'OEBPS/html/book04.html#bk04ch05',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 6',
									'href': 'OEBPS/html/book04.html#bk04ch06',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 7',
									'href': 'OEBPS/html/book04.html#bk04ch07',
									'active': false
								},
								{
									'itemId': 'book04',
									'label': 'CHAPTER 8',
									'href': 'OEBPS/html/book04.html#bk04ch08',
									'active': false
								}
							]
						},
						{
							'itemId': 'book05',
							'label': 'BOOK FIVE',
							'href': 'OEBPS/html/book05.html#bk05',
							'active': false,
							'children': [
								{
									'itemId': 'book05',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book05.html#bk05ch01',
									'active': false
								},
								{
									'itemId': 'book05',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book05.html#bk05ch02',
									'active': false
								},
								{
									'itemId': 'book05',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book05.html#bk05ch03',
									'active': false
								},
								{
									'itemId': 'book05',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book05.html#bk05ch04',
									'active': false
								}
							]
						},
						{
							'itemId': 'book06',
							'label': 'BOOK SIX',
							'href': 'OEBPS/html/book06.html#bk06',
							'active': false,
							'children': [
								{
									'itemId': 'book06',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book06.html#bk06ch01',
									'active': false
								},
								{
									'itemId': 'book06',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book06.html#bk06ch02',
									'active': false
								},
								{
									'itemId': 'book06',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book06.html#bk06ch03',
									'active': false
								},
								{
									'itemId': 'book06',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book06.html#bk06ch04',
									'active': false
								},
								{
									'itemId': 'book06',
									'label': 'CHAPTER 5',
									'href': 'OEBPS/html/book06.html#bk06ch05',
									'active': false
								}
							]
						},
						{
							'itemId': 'book07',
							'label': 'BOOK SEVEN',
							'href': 'OEBPS/html/book07.html#bk07',
							'active': false,
							'children': [
								{
									'itemId': 'book07',
									'label': 'CHAPTER 1',
									'href': 'OEBPS/html/book07.html#bk07ch01',
									'active': false
								},
								{
									'itemId': 'book07',
									'label': 'CHAPTER 2',
									'href': 'OEBPS/html/book07.html#bk07ch02',
									'active': false
								},
								{
									'itemId': 'book07',
									'label': 'CHAPTER 3',
									'href': 'OEBPS/html/book07.html#bk07ch03',
									'active': false
								},
								{
									'itemId': 'book07',
									'label': 'CHAPTER 4',
									'href': 'OEBPS/html/book07.html#bk07ch04',
									'active': false
								},
								{
									'itemId': 'book07',
									'label': 'CHAPTER 5',
									'href': 'OEBPS/html/book07.html#bk07ch05',
									'active': false
								}
							]
						}
					]
				},
				{
					'itemId': 'appendix',
					'label': 'APPENDIX',
					'href': 'OEBPS/html/appendix.html#appor01',
					'active': false
				},
				{
					'itemId': 'map1',
					'label': 'MAPS',
					'href': 'OEBPS/html/map1.html',
					'active': false,
					'children': [
						{
							'itemId': 'map1',
							'label': '1. The Aegean',
							'href': 'OEBPS/html/map1.html#page_410',
							'active': false
						},
						{
							'itemId': 'map2',
							'label': '2. Asia Minor',
							'href': 'OEBPS/html/map2.html#page_411',
							'active': false
						},
						{
							'itemId': 'map3',
							'label': '3. Northern Péloponnèse and North West Greece',
							'href': 'OEBPS/html/map3.html#page_412',
							'active': false
						},
						{
							'itemId': 'map4',
							'label': '4. Central Greece',
							'href': 'OEBPS/html/map4.html#page_413',
							'active': false
						},
						{
							'itemId': 'map5',
							'label': '5. Area of the Isthmus and the Saronic Gulf',
							'href': 'OEBPS/html/map5.html#page_414',
							'active': false
						},
						{
							'itemId': 'map6',
							'label': '6. Central and Southern Peloponnese',
							'href': 'OEBPS/html/map6.html#page_415',
							'active': false
						},
						{
							'itemId': 'map7',
							'label': '7. Chalcidice',
							'href': 'OEBPS/html/map7.html#page_408',
							'active': false
						}
					]
				},
				{
					'itemId': 'index',
					'label': 'INDEX',
					'href': 'OEBPS/html/index.html#bm01',
					'active': false
				},
				{
					'itemId': 'int01notes01',
					'label': 'Footnotes',
					'href': 'OEBPS/html/int01notes01.html',
					'active': false,
					'children': [
						{
							'itemId': 'int01notes01',
							'label': 'INTRODUCTION',
							'href': 'OEBPS/html/int01notes01.html#int01fn01',
							'active': false,
							'children': [
								{
									'itemId': 'int01notes01',
									'label': 'page 8',
									'href': 'OEBPS/html/int01notes01.html#int01notes012',
									'active': false
								},
								{
									'itemId': 'int01notes02',
									'label': 'page 11',
									'href': 'OEBPS/html/int01notes02.html#int01notes02',
									'active': false
								},
								{
									'itemId': 'int01notes03',
									'label': 'page 13',
									'href': 'OEBPS/html/int01notes03.html#int01notes03',
									'active': false
								},
								{
									'itemId': 'int01notes04',
									'label': 'page 16',
									'href': 'OEBPS/html/int01notes04.html#int01notes04',
									'active': false
								},
								{
									'itemId': 'int01notes05',
									'label': 'page 17',
									'href': 'OEBPS/html/int01notes05.html#int01notes05',
									'active': false
								},
								{
									'itemId': 'int01notes06',
									'label': 'page 18',
									'href': 'OEBPS/html/int01notes06.html#int01notes06',
									'active': false
								},
								{
									'itemId': 'int01notes07',
									'label': 'page 29',
									'href': 'OEBPS/html/int01notes07.html#int01notes07',
									'active': false
								},
								{
									'itemId': 'int01notes08',
									'label': 'page 31',
									'href': 'OEBPS/html/int01notes08.html#int01notes08',
									'active': false
								},
								{
									'itemId': 'int01notes09',
									'label': 'page 36',
									'href': 'OEBPS/html/int01notes09.html#int01notes09',
									'active': false
								},
								{
									'itemId': 'int01notes10',
									'label': 'page 41',
									'href': 'OEBPS/html/int01notes10.html#int01fn12',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk01notes01',
							'label': 'BOOK ONE',
							'href': 'OEBPS/html/bk01notes01.html#bk01fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk01notes01',
									'label': 'page 53',
									'href': 'OEBPS/html/bk01notes01.html#bk01notes01',
									'active': false
								},
								{
									'itemId': 'bk01notes02',
									'label': 'page 54',
									'href': 'OEBPS/html/bk01notes02.html#bk01notes02',
									'active': false
								},
								{
									'itemId': 'bk01notes03',
									'label': 'page 56',
									'href': 'OEBPS/html/bk01notes03.html#bk01notes03',
									'active': false
								},
								{
									'itemId': 'bk01notes04',
									'label': 'page 57',
									'href': 'OEBPS/html/bk01notes04.html#bk01notes04',
									'active': false
								},
								{
									'itemId': 'bk01notes05',
									'label': 'page 59',
									'href': 'OEBPS/html/bk01notes05.html#bk01notes05',
									'active': false
								},
								{
									'itemId': 'bk01notes06',
									'label': 'page 60',
									'href': 'OEBPS/html/bk01notes06.html#bk01notes06',
									'active': false
								},
								{
									'itemId': 'bk01notes07',
									'label': 'page 61',
									'href': 'OEBPS/html/bk01notes07.html#bk01notes07',
									'active': false
								},
								{
									'itemId': 'bk01notes08',
									'label': 'page 62',
									'href': 'OEBPS/html/bk01notes08.html#bk01notes08',
									'active': false
								},
								{
									'itemId': 'bk01notes09',
									'label': 'page 64',
									'href': 'OEBPS/html/bk01notes09.html#bk01notes09',
									'active': false
								},
								{
									'itemId': 'bk01notes10',
									'label': 'page 65',
									'href': 'OEBPS/html/bk01notes10.html#bk01notes10',
									'active': false
								},
								{
									'itemId': 'bk01notes11',
									'label': 'page 67',
									'href': 'OEBPS/html/bk01notes11.html#bk01notes11',
									'active': false
								},
								{
									'itemId': 'bk01notes12',
									'label': 'page 68',
									'href': 'OEBPS/html/bk01notes12.html#bk01notes12',
									'active': false
								},
								{
									'itemId': 'bk01notes13',
									'label': 'page 69',
									'href': 'OEBPS/html/bk01notes13.html#bk01notes13',
									'active': false
								},
								{
									'itemId': 'bk01notes14',
									'label': 'page 75',
									'href': 'OEBPS/html/bk01notes14.html#bk01notes14',
									'active': false
								},
								{
									'itemId': 'bk01notes15',
									'label': 'page 76',
									'href': 'OEBPS/html/bk01notes15.html#bk01notes15',
									'active': false
								},
								{
									'itemId': 'bk01notes16',
									'label': 'page 77',
									'href': 'OEBPS/html/bk01notes16.html#bk01notes16',
									'active': false
								},
								{
									'itemId': 'bk01notes17',
									'label': 'page 78',
									'href': 'OEBPS/html/bk01notes17.html#bk01notes17',
									'active': false
								},
								{
									'itemId': 'bk01notes18',
									'label': 'page 79',
									'href': 'OEBPS/html/bk01notes18.html#bk01notes18',
									'active': false
								},
								{
									'itemId': 'bk01notes19',
									'label': 'page 84',
									'href': 'OEBPS/html/bk01notes19.html#bk01notes19',
									'active': false
								},
								{
									'itemId': 'bk01notes20',
									'label': 'page 88',
									'href': 'OEBPS/html/bk01notes20.html#bk01notes20',
									'active': false
								},
								{
									'itemId': 'bk01notes21',
									'label': 'page 91',
									'href': 'OEBPS/html/bk01notes21.html#bk01notes21',
									'active': false
								},
								{
									'itemId': 'bk01notes22',
									'label': 'page 93',
									'href': 'OEBPS/html/bk01notes22.html#bk01fn38',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk02notes01',
							'label': 'BOOK TWO',
							'href': 'OEBPS/html/bk02notes01.html#bk02fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk02notes01',
									'label': 'page 98',
									'href': 'OEBPS/html/bk02notes01.html#bk02notes01',
									'active': false
								},
								{
									'itemId': 'bk02notes02',
									'label': 'page 99',
									'href': 'OEBPS/html/bk02notes02.html#bk02notes02',
									'active': false
								},
								{
									'itemId': 'bk02notes03',
									'label': 'page 100',
									'href': 'OEBPS/html/bk02notes03.html#bk02notes03',
									'active': false
								},
								{
									'itemId': 'bk02notes04',
									'label': 'page 101',
									'href': 'OEBPS/html/bk02notes04.html#bk02notes04',
									'active': false
								},
								{
									'itemId': 'bk02notes05',
									'label': 'page 102',
									'href': 'OEBPS/html/bk02notes05.html#bk02notes05',
									'active': false
								},
								{
									'itemId': 'bk02notes06',
									'label': 'page 104',
									'href': 'OEBPS/html/bk02notes06.html#bk02notes06',
									'active': false
								},
								{
									'itemId': 'bk02notes07',
									'label': 'page 105',
									'href': 'OEBPS/html/bk02notes07.html#bk02notes07',
									'active': false
								},
								{
									'itemId': 'bk02notes08',
									'label': 'page 106',
									'href': 'OEBPS/html/bk02notes08.html#bk02notes08',
									'active': false
								},
								{
									'itemId': 'bk02notes09',
									'label': 'page 107',
									'href': 'OEBPS/html/bk02notes09.html#bk02notes09',
									'active': false
								},
								{
									'itemId': 'bk02notes10',
									'label': 'page 108',
									'href': 'OEBPS/html/bk02notes10.html#bk02notes10',
									'active': false
								},
								{
									'itemId': 'bk02notes11',
									'label': 'page 109',
									'href': 'OEBPS/html/bk02notes11.html#bk02notes11',
									'active': false
								},
								{
									'itemId': 'bk02notes12',
									'label': 'page 110',
									'href': 'OEBPS/html/bk02notes12.html#bk02notes12',
									'active': false
								},
								{
									'itemId': 'bk02notes13',
									'label': 'page 111',
									'href': 'OEBPS/html/bk02notes13.html#bk02notes13',
									'active': false
								},
								{
									'itemId': 'bk02notes14',
									'label': 'page 112',
									'href': 'OEBPS/html/bk02notes14.html#bk02notes14',
									'active': false
								},
								{
									'itemId': 'bk02notes15',
									'label': 'page 113',
									'href': 'OEBPS/html/bk02notes15.html#bk02notes15',
									'active': false
								},
								{
									'itemId': 'bk02notes16',
									'label': 'page 117',
									'href': 'OEBPS/html/bk02notes16.html#bk02notes16',
									'active': false
								},
								{
									'itemId': 'bk02notes17',
									'label': 'page 118',
									'href': 'OEBPS/html/bk02notes17.html#bk02notes17',
									'active': false
								},
								{
									'itemId': 'bk02notes18',
									'label': 'page 119',
									'href': 'OEBPS/html/bk02notes18.html#bk02notes18',
									'active': false
								},
								{
									'itemId': 'bk02notes19',
									'label': 'page 120',
									'href': 'OEBPS/html/bk02notes19.html#bk02notes19',
									'active': false
								},
								{
									'itemId': 'bk02notes20',
									'label': 'page 123',
									'href': 'OEBPS/html/bk02notes20.html#bk02notes20',
									'active': false
								},
								{
									'itemId': 'bk02notes21',
									'label': 'page 126',
									'href': 'OEBPS/html/bk02notes21.html#bk02notes21',
									'active': false
								},
								{
									'itemId': 'bk02notes22',
									'label': 'page 132',
									'href': 'OEBPS/html/bk02notes22.html#bk02notes22',
									'active': false
								},
								{
									'itemId': 'bk02notes23',
									'label': 'page 135',
									'href': 'OEBPS/html/bk02notes23.html#bk02fn28',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk03notes01',
							'label': 'BOOK THREE',
							'href': 'OEBPS/html/bk03notes01.html#bk03fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk03notes01',
									'label': 'page 139',
									'href': 'OEBPS/html/bk03notes01.html#bk03notes01',
									'active': false
								},
								{
									'itemId': 'bk03notes02',
									'label': 'page 140',
									'href': 'OEBPS/html/bk03notes02.html#bk03notes02',
									'active': false
								},
								{
									'itemId': 'bk03notes03',
									'label': 'page 141',
									'href': 'OEBPS/html/bk03notes03.html#bk03notes03',
									'active': false
								},
								{
									'itemId': 'bk03notes04',
									'label': 'page 148',
									'href': 'OEBPS/html/bk03notes04.html#bk03notes04',
									'active': false
								},
								{
									'itemId': 'bk03notes05',
									'label': 'page 149',
									'href': 'OEBPS/html/bk03notes05.html#bk03notes05',
									'active': false
								},
								{
									'itemId': 'bk03notes06',
									'label': 'page 150',
									'href': 'OEBPS/html/bk03notes06.html#bk03notes06',
									'active': false
								},
								{
									'itemId': 'bk03notes07',
									'label': 'page 151',
									'href': 'OEBPS/html/bk03notes07.html#bk03notes07',
									'active': false
								},
								{
									'itemId': 'bk03notes08',
									'label': 'page 154',
									'href': 'OEBPS/html/bk03notes08.html#bk03notes08',
									'active': false
								},
								{
									'itemId': 'bk03notes09',
									'label': 'page 155',
									'href': 'OEBPS/html/bk03notes09.html#bk03notes09',
									'active': false
								},
								{
									'itemId': 'bk03notes10',
									'label': 'page 156',
									'href': 'OEBPS/html/bk03notes10.html#bk03notes10',
									'active': false
								},
								{
									'itemId': 'bk03notes11',
									'label': 'page 159',
									'href': 'OEBPS/html/bk03notes11.html#bk03notes11',
									'active': false
								},
								{
									'itemId': 'bk03notes12',
									'label': 'page 160',
									'href': 'OEBPS/html/bk03notes12.html#bk03notes12',
									'active': false
								},
								{
									'itemId': 'bk03notes13',
									'label': 'page 161',
									'href': 'OEBPS/html/bk03notes13.html#bk03notes13',
									'active': false
								},
								{
									'itemId': 'bk03notes14',
									'label': 'page 163',
									'href': 'OEBPS/html/bk03notes14.html#bk03notes14',
									'active': false
								},
								{
									'itemId': 'bk03notes15',
									'label': 'page 164',
									'href': 'OEBPS/html/bk03notes15.html#bk03notes15',
									'active': false
								},
								{
									'itemId': 'bk03notes16',
									'label': 'page 165',
									'href': 'OEBPS/html/bk03notes16.html#bk03notes16',
									'active': false
								},
								{
									'itemId': 'bk03notes17',
									'label': 'page 167',
									'href': 'OEBPS/html/bk03notes17.html#bk03notes17',
									'active': false
								},
								{
									'itemId': 'bk03notes18',
									'label': 'page 170',
									'href': 'OEBPS/html/bk03notes18.html#bk03notes18',
									'active': false
								},
								{
									'itemId': 'bk03notes19',
									'label': 'page 172',
									'href': 'OEBPS/html/bk03notes19.html#bk03notes19',
									'active': false
								},
								{
									'itemId': 'bk03notes20',
									'label': 'page 173',
									'href': 'OEBPS/html/bk03notes20.html#bk03notes20',
									'active': false
								},
								{
									'itemId': 'bk03notes21',
									'label': 'page 174',
									'href': 'OEBPS/html/bk03notes21.html#bk03notes21',
									'active': false
								},
								{
									'itemId': 'bk03notes22',
									'label': 'page 175',
									'href': 'OEBPS/html/bk03notes22.html#bk03notes22',
									'active': false
								},
								{
									'itemId': 'bk03notes23',
									'label': 'page 176',
									'href': 'OEBPS/html/bk03notes23.html#bk03notes23',
									'active': false
								},
								{
									'itemId': 'bk03notes24',
									'label': 'page 178',
									'href': 'OEBPS/html/bk03notes24.html#bk03notes24',
									'active': false
								},
								{
									'itemId': 'bk03notes25',
									'label': 'page 181',
									'href': 'OEBPS/html/bk03notes25.html#bk03fn29',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk04notes01',
							'label': 'BOOK FOUR',
							'href': 'OEBPS/html/bk04notes01.html#bk04fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk04notes01',
									'label': 'page 185',
									'href': 'OEBPS/html/bk04notes01.html#bk04notes01',
									'active': false
								},
								{
									'itemId': 'bk04notes02',
									'label': 'page 187',
									'href': 'OEBPS/html/bk04notes02.html#bk04notes02',
									'active': false
								},
								{
									'itemId': 'bk04notes03',
									'label': 'page 189',
									'href': 'OEBPS/html/bk04notes03.html#bk04notes03',
									'active': false
								},
								{
									'itemId': 'bk04notes04',
									'label': 'page 193',
									'href': 'OEBPS/html/bk04notes04.html#bk04notes04',
									'active': false
								},
								{
									'itemId': 'bk04notes05',
									'label': 'page 194',
									'href': 'OEBPS/html/bk04notes05.html#bk04notes05',
									'active': false
								},
								{
									'itemId': 'bk04notes06',
									'label': 'page 195',
									'href': 'OEBPS/html/bk04notes06.html#bk04notes06',
									'active': false
								},
								{
									'itemId': 'bk04notes08',
									'label': 'page 196',
									'href': 'OEBPS/html/bk04notes08.html#bk04notes08',
									'active': false
								},
								{
									'itemId': 'bk04notes10',
									'label': 'page 197',
									'href': 'OEBPS/html/bk04notes10.html#bk04notes10',
									'active': false
								},
								{
									'itemId': 'bk04notes11',
									'label': 'page 198',
									'href': 'OEBPS/html/bk04notes11.html#bk04notes11',
									'active': false
								},
								{
									'itemId': 'bk04notes13',
									'label': 'page 201',
									'href': 'OEBPS/html/bk04notes13.html#bk04notes13',
									'active': false
								},
								{
									'itemId': 'bk04notes14',
									'label': 'page 203',
									'href': 'OEBPS/html/bk04notes14.html#bk04notes14',
									'active': false
								},
								{
									'itemId': 'bk04notes15',
									'label': 'page 204',
									'href': 'OEBPS/html/bk04notes15.html#bk04notes15',
									'active': false
								},
								{
									'itemId': 'bk04notes16',
									'label': 'page 208',
									'href': 'OEBPS/html/bk04notes16.html#bk04notes16',
									'active': false
								},
								{
									'itemId': 'bk04notes17',
									'label': 'page 209',
									'href': 'OEBPS/html/bk04notes17.html#bk04notes17',
									'active': false
								},
								{
									'itemId': 'bk04notes18',
									'label': 'page 212',
									'href': 'OEBPS/html/bk04notes18.html#bk04notes18',
									'active': false
								},
								{
									'itemId': 'bk04notes213',
									'label': 'page 213',
									'href': 'OEBPS/html/bk04notes213.html#bk04notes213',
									'active': false
								},
								{
									'itemId': 'bk04notes20',
									'label': 'page 214',
									'href': 'OEBPS/html/bk04notes20.html#bk04notes20',
									'active': false
								},
								{
									'itemId': 'bk04notes21',
									'label': 'page 216',
									'href': 'OEBPS/html/bk04notes21.html#bk04notes21',
									'active': false
								},
								{
									'itemId': 'bk04notes22',
									'label': 'page 219',
									'href': 'OEBPS/html/bk04notes22.html#bk04notes22',
									'active': false
								},
								{
									'itemId': 'bk04notes23',
									'label': 'page 220',
									'href': 'OEBPS/html/bk04notes23.html#bk04notes23',
									'active': false
								},
								{
									'itemId': 'bk04notes24',
									'label': 'page 227',
									'href': 'OEBPS/html/bk04notes24.html#bk04notes24',
									'active': false
								},
								{
									'itemId': 'bk04notes25',
									'label': 'page 232',
									'href': 'OEBPS/html/bk04notes25.html#bk04notes25',
									'active': false
								},
								{
									'itemId': 'bk04notes26',
									'label': 'page 234',
									'href': 'OEBPS/html/bk04notes26.html#bk04notes26',
									'active': false
								},
								{
									'itemId': 'bk04notes27',
									'label': 'page 239',
									'href': 'OEBPS/html/bk04notes27.html#bk04fn29',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk05notes01',
							'label': 'BOOK FIVE',
							'href': 'OEBPS/html/bk05notes01.html#bk05fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk05notes01',
									'label': 'page 245',
									'href': 'OEBPS/html/bk05notes01.html#bk05notes01',
									'active': false
								},
								{
									'itemId': 'bk05notes02',
									'label': 'page 246',
									'href': 'OEBPS/html/bk05notes02.html#bk05notes02',
									'active': false
								},
								{
									'itemId': 'bk05notes03',
									'label': 'page 248',
									'href': 'OEBPS/html/bk05notes03.html#bk05notes03',
									'active': false
								},
								{
									'itemId': 'bk05notes04',
									'label': 'page 249',
									'href': 'OEBPS/html/bk05notes04.html#bk05notes04',
									'active': false
								},
								{
									'itemId': 'bk05notes05',
									'label': 'page 254',
									'href': 'OEBPS/html/bk05notes05.html#bk05notes05',
									'active': false
								},
								{
									'itemId': 'bk05notes06',
									'label': 'page 255',
									'href': 'OEBPS/html/bk05notes06.html#bk05notes06',
									'active': false
								},
								{
									'itemId': 'bk05notes07',
									'label': 'page 256',
									'href': 'OEBPS/html/bk05notes07.html#bk05notes07',
									'active': false
								},
								{
									'itemId': 'bk05notes08',
									'label': 'page 257',
									'href': 'OEBPS/html/bk05notes08.html#bk05notes08',
									'active': false
								},
								{
									'itemId': 'bk05notes10',
									'label': 'page 258',
									'href': 'OEBPS/html/bk05notes10.html#bk05notes10',
									'active': false
								},
								{
									'itemId': 'bk05notes12',
									'label': 'page 259',
									'href': 'OEBPS/html/bk05notes12.html#bk05notes12',
									'active': false
								},
								{
									'itemId': 'bk05notes13',
									'label': 'page 261',
									'href': 'OEBPS/html/bk05notes13.html#bk05notes13',
									'active': false
								},
								{
									'itemId': 'bk05notes14',
									'label': 'page 262',
									'href': 'OEBPS/html/bk05notes14.html#bk05notes14',
									'active': false
								},
								{
									'itemId': 'bk05notes16',
									'label': 'page 263',
									'href': 'OEBPS/html/bk05notes16.html#bk05notes16',
									'active': false
								},
								{
									'itemId': 'bk05notes17',
									'label': 'page 265',
									'href': 'OEBPS/html/bk05notes17.html#bk05notes17',
									'active': false
								},
								{
									'itemId': 'bk05notes18',
									'label': 'page 266',
									'href': 'OEBPS/html/bk05notes18.html#bk05notes18',
									'active': false
								},
								{
									'itemId': 'bk05notes19',
									'label': 'page 267',
									'href': 'OEBPS/html/bk05notes19.html#bk05notes19',
									'active': false
								},
								{
									'itemId': 'bk05notes20',
									'label': 'page 273',
									'href': 'OEBPS/html/bk05notes20.html#bk05notes20',
									'active': false
								},
								{
									'itemId': 'bk05notes22',
									'label': 'page 275',
									'href': 'OEBPS/html/bk05notes22.html#bk05notes22',
									'active': false
								},
								{
									'itemId': 'bk05notes23',
									'label': 'page 279',
									'href': 'OEBPS/html/bk05notes23.html#bk05notes23',
									'active': false
								},
								{
									'itemId': 'bk05notes25',
									'label': 'page 282',
									'href': 'OEBPS/html/bk05notes25.html#bk05notes25',
									'active': false
								},
								{
									'itemId': 'bk05notes27',
									'label': 'page 283',
									'href': 'OEBPS/html/bk05notes27.html#bk05notes27',
									'active': false
								},
								{
									'itemId': 'bk05notes29',
									'label': 'page 285',
									'href': 'OEBPS/html/bk05notes29.html#bk05notes29',
									'active': false
								},
								{
									'itemId': 'bk05notes30',
									'label': 'page 289',
									'href': 'OEBPS/html/bk05notes30.html#bk05notes30',
									'active': false
								},
								{
									'itemId': 'bk05notes33',
									'label': 'page 291',
									'href': 'OEBPS/html/bk05notes33.html#bk05notes33',
									'active': false
								},
								{
									'itemId': 'bk05notes34',
									'label': 'page 292',
									'href': 'OEBPS/html/bk05notes34.html#bk05notes34',
									'active': false
								},
								{
									'itemId': 'bk05notes35',
									'label': 'page 294',
									'href': 'OEBPS/html/bk05notes35.html#bk05notes35',
									'active': false
								},
								{
									'itemId': 'bk05notes36',
									'label': 'page 295',
									'href': 'OEBPS/html/bk05notes36.html#bk05notes36',
									'active': false
								},
								{
									'itemId': 'bk05notes37',
									'label': 'page 297',
									'href': 'OEBPS/html/bk05notes37.html#bk05fn37',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk05notes39',
							'label': 'BOOK SIX',
							'href': 'OEBPS/html/bk05notes39.html#bk05fn39',
							'active': false,
							'children': [
								{
									'itemId': 'bk05notes39',
									'label': 'page 298',
									'href': 'OEBPS/html/bk05notes39.html#bk05notes39',
									'active': false
								},
								{
									'itemId': 'bk06notes01',
									'label': 'page 301',
									'href': 'OEBPS/html/bk06notes01.html#bk06notes01',
									'active': false
								},
								{
									'itemId': 'bk06notes02',
									'label': 'page 302',
									'href': 'OEBPS/html/bk06notes02.html#bk06notes02',
									'active': false
								},
								{
									'itemId': 'bk06notes03',
									'label': 'page 304',
									'href': 'OEBPS/html/bk06notes03.html#bk06notes03',
									'active': false
								},
								{
									'itemId': 'bk06notes04',
									'label': 'page 308',
									'href': 'OEBPS/html/bk06notes04.html#bk06notes04',
									'active': false
								},
								{
									'itemId': 'bk06notes06',
									'label': 'page 309',
									'href': 'OEBPS/html/bk06notes06.html#bk06notes06',
									'active': false
								},
								{
									'itemId': 'bk06notes08',
									'label': 'page 310',
									'href': 'OEBPS/html/bk06notes08.html#bk06notes08',
									'active': false
								},
								{
									'itemId': 'bk06notes09',
									'label': 'page 317',
									'href': 'OEBPS/html/bk06notes09.html#bk06notes09',
									'active': false
								},
								{
									'itemId': 'bk06notes11',
									'label': 'page 322',
									'href': 'OEBPS/html/bk06notes11.html#bk06notes11',
									'active': false
								},
								{
									'itemId': 'bk06notes12',
									'label': 'page 323',
									'href': 'OEBPS/html/bk06notes12.html#bk06notes12',
									'active': false
								},
								{
									'itemId': 'bk06notes13',
									'label': 'page 324',
									'href': 'OEBPS/html/bk06notes13.html#bk06notes13',
									'active': false
								},
								{
									'itemId': 'bk06notes14',
									'label': 'page 328',
									'href': 'OEBPS/html/bk06notes14.html#bk06notes14',
									'active': false
								},
								{
									'itemId': 'bk06notes16',
									'label': 'page 332',
									'href': 'OEBPS/html/bk06notes16.html#bk06notes16',
									'active': false
								},
								{
									'itemId': 'bk06notes17',
									'label': 'page 334',
									'href': 'OEBPS/html/bk06notes17.html#bk06notes17',
									'active': false
								},
								{
									'itemId': 'bk06notes18',
									'label': 'page 335',
									'href': 'OEBPS/html/bk06notes18.html#bk06notes18',
									'active': false
								},
								{
									'itemId': 'bk06notes19',
									'label': 'page 336',
									'href': 'OEBPS/html/bk06notes19.html#bk06notes19',
									'active': false
								},
								{
									'itemId': 'bk06notes20',
									'label': 'page 337',
									'href': 'OEBPS/html/bk06notes20.html#bk06notes20',
									'active': false
								},
								{
									'itemId': 'bk06notes21',
									'label': 'page 338',
									'href': 'OEBPS/html/bk06notes21.html#bk06notes21',
									'active': false
								},
								{
									'itemId': 'bk06notes22',
									'label': 'page 341',
									'href': 'OEBPS/html/bk06notes22.html#bk06notes22',
									'active': false
								},
								{
									'itemId': 'bk06notes23',
									'label': 'page 342',
									'href': 'OEBPS/html/bk06notes23.html#bk06notes23',
									'active': false
								},
								{
									'itemId': 'bk06notes24',
									'label': 'page 343',
									'href': 'OEBPS/html/bk06notes24.html#bk06notes24',
									'active': false
								},
								{
									'itemId': 'bk06notes25',
									'label': 'page 344',
									'href': 'OEBPS/html/bk06notes25.html#bk06notes25',
									'active': false
								},
								{
									'itemId': 'bk06notes26',
									'label': 'page 346',
									'href': 'OEBPS/html/bk06notes26.html#bk06notes26',
									'active': false
								},
								{
									'itemId': 'bk06notes27',
									'label': 'page 351',
									'href': 'OEBPS/html/bk06notes27.html#bk06fn27',
									'active': false
								}
							]
						},
						{
							'itemId': 'bk07notes01',
							'label': 'BOOK SEVEN',
							'href': 'OEBPS/html/bk07notes01.html#bk07fn01',
							'active': false,
							'children': [
								{
									'itemId': 'bk07notes01',
									'label': 'page 359',
									'href': 'OEBPS/html/bk07notes01.html#bk07notes01',
									'active': false
								},
								{
									'itemId': 'bk07notes02',
									'label': 'page 362',
									'href': 'OEBPS/html/bk07notes02.html#bk07notes02',
									'active': false
								},
								{
									'itemId': 'bk07notes03',
									'label': 'page 363',
									'href': 'OEBPS/html/bk07notes03.html#bk07notes03',
									'active': false
								},
								{
									'itemId': 'bk07notes04',
									'label': 'page 364',
									'href': 'OEBPS/html/bk07notes04.html#bk07notes04',
									'active': false
								},
								{
									'itemId': 'bk07notes05',
									'label': 'page 365',
									'href': 'OEBPS/html/bk07notes05.html#bk07notes05',
									'active': false
								},
								{
									'itemId': 'bk07notes06',
									'label': 'page 366',
									'href': 'OEBPS/html/bk07notes06.html#bk07notes06',
									'active': false
								},
								{
									'itemId': 'bk07notes07',
									'label': 'page 367',
									'href': 'OEBPS/html/bk07notes07.html#bk07notes07',
									'active': false
								},
								{
									'itemId': 'bk07notes08',
									'label': 'page 370',
									'href': 'OEBPS/html/bk07notes08.html#bk07notes08',
									'active': false
								},
								{
									'itemId': 'bk07notes09',
									'label': 'page 381',
									'href': 'OEBPS/html/bk07notes09.html#bk07notes09',
									'active': false
								},
								{
									'itemId': 'bk07notes10',
									'label': 'page 382',
									'href': 'OEBPS/html/bk07notes10.html#bk07notes10',
									'active': false
								},
								{
									'itemId': 'bk07notes11',
									'label': 'page 384',
									'href': 'OEBPS/html/bk07notes11.html#bk07notes11',
									'active': false
								},
								{
									'itemId': 'bk07notes12',
									'label': 'page 385',
									'href': 'OEBPS/html/bk07notes12.html#bk07notes12',
									'active': false
								},
								{
									'itemId': 'bk07notes13',
									'label': 'page 388',
									'href': 'OEBPS/html/bk07notes13.html#bk07notes13',
									'active': false
								},
								{
									'itemId': 'bk07notes14',
									'label': 'page 392',
									'href': 'OEBPS/html/bk07notes14.html#bk07notes14',
									'active': false
								},
								{
									'itemId': 'bk07notes15',
									'label': 'page 393',
									'href': 'OEBPS/html/bk07notes15.html#bk07notes15',
									'active': false
								},
								{
									'itemId': 'bk07notes16',
									'label': 'page 396',
									'href': 'OEBPS/html/bk07notes16.html#bk07notes16',
									'active': false
								},
								{
									'itemId': 'bk07notes17',
									'label': 'page 399',
									'href': 'OEBPS/html/bk07notes17.html#bk07notes17',
									'active': false
								},
								{
									'itemId': 'bk07notes18',
									'label': 'page 401',
									'href': 'OEBPS/html/bk07notes18.html#bk07notes18',
									'active': false
								},
								{
									'itemId': 'bk07notes19',
									'label': 'page 402',
									'href': 'OEBPS/html/bk07notes19.html#bk07notes19',
									'active': false
								},
								{
									'itemId': 'bk07notes20',
									'label': 'page 403',
									'href': 'OEBPS/html/bk07notes20.html#bk07notes20',
									'active': false
								}
							]
						}
					]
				}
			],
			'spine': [
				{
					'itemId': 'cover',
					'href': 'OEBPS/html/cover.html',
					'mediaType': 'application/xhtml+xml',
					'linear': true,
					'wordCount': 0
				},
				{
					'itemId': 'frontmatter',
					'href': 'OEBPS/html/frontmatter.html',
					'mediaType': 'application/xhtml+xml',
					'linear': true,
					'wordCount': 603
				},
				{
					'itemId': 'introduction',
					'href': 'OEBPS/html/introduction.html',
					'mediaType': 'application/xhtml+xml',
					'linear': true,
					'wordCount': 12885
				},
				{
					'itemId': 'book01',
					'href': 'OEBPS/html/book01.html',
					'mediaType': 'application/xhtml+xml',
					'linear': true,
					'wordCount': 1234
				}
			]
		},
		'DATA': {
			'content_path_prefix': 'OEBPS/html',
			'opf': '<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="p9780140441758"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>A History of My Times</dc:title><dc:creator>Xenophon</dc:creator><dc:date>2007</dc:date><dc:identifier id="p9780140441758">ISBN: 978-0-14-192685-8</dc:identifier><dc:format>425 pages</dc:format><dc:coverage>London</dc:coverage><dc:coverage>New York</dc:coverage><dc:coverage>Ontario</dc:coverage><dc:coverage>Dublin</dc:coverage><dc:coverage>Camberwell</dc:coverage><dc:coverage>New Delhi</dc:coverage><dc:coverage>Albany</dc:coverage><dc:coverage>Rosebank</dc:coverage><dc:type>Text</dc:type><dc:language>en</dc:language><dc:rights>All rights reserved.</dc:rights><dc:publisher>Penguin Books</dc:publisher></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="cover.html" media-type="application/xhtml+xml"/><item id="frontmatter" href="frontmatter.html" media-type="application/xhtml+xml"/><item id="introduction" href="introduction.html" media-type="application/xhtml+xml"/><item id="css" href="9780140441758.css" media-type="text/css"/><item id="pub01" href="images/pub.jpg" media-type="image/jpeg"/><item id="pt" href="page-template.xpgt" media-type="application/vnd.adobe-page-template+xml"/></manifest><spine toc="ncx" page-map="map"><itemref idref="cover"/><itemref idref="frontmatter"/><itemref idref="introduction"/><itemref idref="book01"/></spine></package>'
		}
	}
};

fixtures.BOOK.DATA.title = fixtures.BOOK.DATA_RAW.title;
fixtures.BOOK.DATA.spine = fixtures.BOOK.DATA_RAW.spine;
fixtures.BOOK.DATA.toc = fixtures.BOOK.DATA_RAW.toc;
fixtures.BOOK.DATA.$opf = $(fixtures.BOOK.DATA.opf).filter('package');

fixtures.BOOK_2.DATA.title = fixtures.BOOK_2.DATA_RAW.title;
fixtures.BOOK_2.DATA.spine = fixtures.BOOK_2.DATA_RAW.spine;
fixtures.BOOK_2.DATA.toc = fixtures.BOOK_2.DATA_RAW.toc;
fixtures.BOOK_2.DATA.$opf = $(fixtures.BOOK_2.DATA.opf).filter('package');
