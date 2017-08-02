angular.module('app', [

    // external libs
    'ngRoute',
    'ngMessages',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngMaterial',
    'ngProgress',

    // this is how it accesses the cached templates in ti.js
    'templates.app',

    // services
    'numFormat',

    // pages
    "landing",
    "staticPages"

]);




angular.module('app').config(function ($routeProvider,
                                       $mdThemingProvider,
                                       $locationProvider) {
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette("blue")



});




angular.module('app').run(function($route,
                                   $rootScope,
                                   $q,
                                   $timeout,
                                   $cookies,

                                   $http,
                                   $location) {

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-23384030-5', 'auto');





    $rootScope.$on('$routeChangeStart', function(next, current){
    })
    $rootScope.$on('$routeChangeSuccess', function(next, current){
        //window.scrollTo(0, 0)
        ga('send', 'pageview', { page: $location.url() });

    })



    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
        console.log("$routeChangeError! here's some things to look at: ", event, current, previous, rejection)

        $location.url("page-not-found")
        window.scrollTo(0, 0)
    });
});



angular.module('app').controller('AppCtrl', function(
    ngProgressFactory,
    $rootScope,
    $scope,
    $route,
    $location,
    NumFormat,
    $http,
    $mdDialog,
    $sce){

    console.log("the angular app is running")

    var progressBarInstance = ngProgressFactory.createInstance();

    $rootScope.progressbar = progressBarInstance
    $scope.progressbar = progressBarInstance
    $scope.numFormat = NumFormat
    $scope.moment = moment // this will break unless moment.js loads over network...

    $scope.global = {}

    $scope.pageTitle = function(){
        if ($scope.global.title){
            return "oaDOI: " + $scope.global.title
        }
        else {
            return "oaDOI"
        }
    }





    $rootScope.$on('$routeChangeSuccess', function(next, current){
        if (current.loadedTemplateUrl) {
            $scope.global.template = current.loadedTemplateUrl
                .replace("/", "-")
                .replace(".tpl.html", "")
        }


        $scope.global.title = null
    })

    $scope.trustHtml = function(str){
        return $sce.trustAsHtml(str)
    }

    var showAlert = function(msgText, titleText, okText){
        if (!okText){
            okText = "ok"
        }
          $mdDialog.show(
                  $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title(titleText)
                    .textContent(msgText)
                    .ok(okText)
            );
    }
    $rootScope.showAlert = showAlert
})
















angular.module('landing', [
    'ngRoute',
    'ngMessages',
    'duScroll'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/landing/:landingPageName', {
            templateUrl: "landing.tpl.html",
            controller: "LandingPageCtrl"
        })
    })

    .controller("LandingPageCtrl", function ($scope,
                                             $http,
                                             $rootScope,
                                             $location,
                                             $document,
                                             $interval,
                                             $timeout) {

        console.log("landing page.")
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        var oneServedEvery = 604;  // one served every 2000 ms
        var startTimestampMs = 1485907200 * 1000;  // feb 1 2017
        var elapsedMs = Date.now() - startTimestampMs;
        var numServed = Math.floor(elapsedMs / oneServedEvery);


        $scope.d = {}
        $scope.d.numServed = numberWithCommas(numServed)

        function tick(){
            var fuzz = Math.random() + .5;
            var waitFor = oneServedEvery * fuzz
            numServed += 1
            $scope.d.numServed = numberWithCommas(numServed)
            console.log("tick")

            if ($location.pathname){
                return false
            }
            else {
                return $timeout(tick, waitFor)
            }

        }

        //tick()


        var moreSection = angular.element(document.getElementById('show-rest-of-landing-page'));

        $scope.scrollToMore = function(){
            console.log("scroll to about!", moreSection)
            $document.scrollToElement(moreSection, 0, 1000);
        }


        //$interval(function(){
        //    numServed += 1
        //    $scope.d.numServed = numberWithCommas(numServed)
        //    console.log("tick")
        //}, oneServedEvery)







    })











angular.module("numFormat", [])

    .factory("NumFormat", function($location){

        var commas = function(x) { // from stackoverflow
            if (!x) {
                return x
            }
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }


        var short = function(num, fixedAt){
            if (typeof num === "string"){
                return num  // not really a number
            }

            // from http://stackoverflow.com/a/14994860/226013
            if (num === null){
                return 0
            }
            if (num === 0){
                return 0
            }

            if (num >= 1000000) {
                return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
            }
            if (num >= 100000) { // no decimal if greater than 100thou
                return (num / 1000).toFixed(0).replace(/\.0$/, '') + 'k';
            }

            if (num >= 1000) {
                return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
            }


            if (num < 1) {
                return Math.round(num * 100) / 100;  // to two decimals
            }

            return Math.ceil(num);
        }

        var round = function(num){
            return Math.round(num)
        }

        var doubleUrlEncode = function(str){
            return encodeURIComponent( encodeURIComponent(str) )
        }

        // from http://cwestblog.com/2012/09/28/javascript-number-getordinalfor/
        var ordinal = function(n) {
            n = Math.round(n)
            var s=["th","st","nd","rd"],
                v=n%100;
            return n+(s[(v-20)%10]||s[v]||s[0]);
        }

        var decimalToPerc = function(decimal, asOrdinal){
            var ret = Math.round(decimal * 100)
            if (asOrdinal){
                ret = ordinal(ret)
            }
            return ret
        }
        return {
            short: short,
            commas: commas,
            round: round,
            ordinal: ordinal,
            doubleUrlEncode: doubleUrlEncode,
            decimalToPerc: decimalToPerc

        }
    });
angular.module('staticPages', [
    'ngRoute',
    'ngMessages'
])

    .config(function ($routeProvider) {
        $routeProvider.when('/unpaywall', {
            templateUrl: "unpaywall.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/sfx', {
            templateUrl: "sfx.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/api', {
            templateUrl: "api.tpl.html",
            controller: "StaticPageCtrl"
        })
    })

    .config(function ($routeProvider) {
        $routeProvider.when('/faq', {
            templateUrl: "faq.tpl.html",
            controller: "StaticPageCtrl"
        })
    })
    .config(function ($routeProvider) {
        $routeProvider.when('/sla', {
            templateUrl: "sla.tpl.html",
            controller: "StaticPageCtrl"
        })
    })


    .config(function ($routeProvider) {
        $routeProvider.when('/about', {redirectTo: "/faq"})
    })


    .controller("StaticPageCtrl", function ($scope,
                                             $http,
                                             $rootScope,
                                             $timeout) {


        $scope.global.title = $scope.global.template

        console.log("static page ctrl")
        $timeout(function(){
            if ($scope.global.template.indexOf("api") >= 0){
                hljs.initHighlighting();
            }

        }, 0)

    })











angular.module('templates.app', ['api.tpl.html', 'browser-tools.tpl.html', 'faq.tpl.html', 'footer.tpl.html', 'landing.tpl.html', 'sfx.tpl.html', 'sla.tpl.html', 'team.tpl.html', 'unpaywall.tpl.html']);

angular.module("api.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("api.tpl.html",
    "<div class=\"page api\">\n" +
    "    <h1>API and dataset</h1>\n" +
    "    \n" +
    "    <p>\n" +
    "        There are two ways to get access to the oaDOI dataset: the API is the best bet for most\n" +
    "        uses because it's simple, fast, and easy to get running; the dataset is great for\n" +
    "        large-scale research and data mining.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Since we're\n" +
    "        dealing with 90 million articles, it takes a while to run a given version of our OA-detection\n" +
    "        algorithm across the\n" +
    "        entire dataset. This means that at any given time there are results from multiple versions\n" +
    "        of the algorithm\n" +
    "        co-existing in the database. You can generally ignore this, but for some research\n" +
    "        uses (including\n" +
    "        replicating our <a\n" +
    "            href=\"https://docs.google.com/document/d/1J9l8rhrT_tMfsw6cqjOnW9GuxBh2b0OYqke1vAWw73g/edit#\">recent study</a>),\n" +
    "        it's important to take into account. For any given DOI, you can check the\n" +
    "        <code>algorithm_version</code> key to see which algorithm generated the data we're reporting.\n" +
    "        (in the case of the study, we limited results to ones obtained from version 2 of the algorithm).\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "        If you're using the API or dataset, we recommend you subscribe to the\n" +
    "        <a href=\"https://groups.google.com/forum/#!forum/oadoi-users\">mailing list</a> in order\n" +
    "        to stay up-to-date when there are changes or new features.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2>API</h2>\n" +
    "\n" +
    "    <p>\n" +
    "        Our REST API gives anyone free, programmatic access to all of oaDOI's data.\n" +
    "        There's currently no rate limit, although if you need more than 100k calls/day you\n" +
    "        may want to download the dataset instead.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Requests must include your email, so that we can\n" +
    "        get in touch if something breaks, and so we can report usage to our funders.\n" +
    "        Add the email as a parameter at the end of the URL, like this:\n" +
    "        <code>?email=YOUR_EMAIL</code>.\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "        The API is very simple, and has just two endpoints. Both are read-only.\n" +
    "    </p>\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <p>\n" +
    "        <code class=\"endpoint\">GET /</code>\n" +
    "\n" +
    "            gets information about the API.\n" +
    "            Returns a status object with version number. Try it here:\n" +
    "             <a href=\"https://api.oadoi.org\">https://api.oadoi.org?email=test@example.com</a>\n" +
    "        </p>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div class=\"endpoint\">\n" +
    "        <p>\n" +
    "        <code class=\"endpoint\">GET /:doi</code>\n" +
    "            gets data about a single DOI.  Try this example:\n" +
    "            <a href=\"https://api.oadoi.org/10.1038/nature12373\">https://api.oadoi.org/10.1038/nature12373?email=test@example.com</a>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <h2 id=\"dataset\">Download the dataset</h2>\n" +
    "    <p>\n" +
    "        The dataset behind the oaDOI API is available for download as a big CSV file. It's free for use in\n" +
    "        non-commercial academic research.\n" +
    "        <a href=\"mailto:team@impactstory.org\">Contact us</a> if you're interested in downloading it.\n" +
    "\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        If you'd like to download the dataset for commercial\n" +
    "        use, check out our\n" +
    "        <a href=\"sla\">service-level agreement</a> program.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "    <h2 id=\"return-format\">Return format</h2>\n" +
    "    <div>\n" +
    "        The labels for data are the same whether you're looking at JSON keys in API, or\n" +
    "        column names in the dataset. Here are the labels, and some notes describing them.\n" +
    "        Note that there may also be other experimental keys/columns at any given time, so\n" +
    "        don't count on the number of keys remaining the same, and don't count on any\n" +
    "        keys remaining the same, other than the stable ones described below:\n" +
    "    </div>\n" +
    "\n" +
    "    <ul class=\"response-details\">\n" +
    "        <li><code>algorithm_version</code>: Number. Represents the version of the OA-detection algorithm we used to gather data on this DOI.</li>\n" +
    "        <li><code>doi</code>: the requested DOI</li>\n" +
    "        <li><code>doi_resolver</code>: String. Possible values:\n" +
    "            <ul>\n" +
    "                <li>crossref</li>\n" +
    "                <li>datacite</li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <li><code>evidence</code>: String. A phrase summarizing the step of our OA detection process where we found the <code>free_fulltext_url</code>.</li>\n" +
    "        <li><code>free_fulltext_url</code>: String. The url where we found a free-to-read version of the DOI. None when no free-to-read version was found.\n" +
    "        <li><code>is_boai_license</code>: Boolean. True whenever the <code>license</code> is cc-by, cc0, or PD.  This is the highly-regarded <a href=\"http://www.budapestopenaccessinitiative.org/read\">BOAI definition</a> of Open access</li>\n" +
    "        <li><code>is_free_to_read</code>: Boolean. True whenever the <code>free_fulltext_url</code> is not None.</li>\n" +
    "        <li><code>is_subscription_journal</code>: Boolean. True whenever the journal is not in the Directory of Open Access Journals or DataCite.</li>\n" +
    "        <li><code>license</code>: String. Contains the name of the Creative Commons license associated with the <code>free_fulltext_url</code>, whenever we find one.  Example: \"cc-by\".</li>\n" +
    "        <li><code>oa_color</code>: String. Possible values:\n" +
    "            <ul>\n" +
    "                <li>green</li>\n" +
    "                <li>gold</li>\n" +
    "            </ul>\n" +
    "        </li>\n" +
    "        <li><code>url</code>: the canonical DOI URL</li>\n" +
    "\n" +
    "    </ul>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("browser-tools.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("browser-tools.tpl.html",
    "<div class=\"page browser-tools\">\n" +
    "    <h1>Browser tools</h1>\n" +
    "\n" +
    "        <p>\n" +
    "        The power of oaDOI is now available as a Chrome Extension!  As you browse,\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "    <!--\n" +
    "        <p>\n" +
    "            These tools do more or less the same thing: when you're\n" +
    "            viewing the landing page for a scholarly article, they'll use oaDOI to find\n" +
    "            any open versions of that article. Both of them only work on pages\n" +
    "            with DOIs.\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Chrome Extension</h2>\n" +
    "        <p>\n" +
    "            The beta release is now available! Install it via the Chrome Web Store:\n" +
    "            <a href=\"https://chrome.google.com/webstore/detail/getthepdf/iplffkdpngmdjhlpjmppncnlhomiipha\">\n" +
    "                un\n" +
    "            </a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <h2>Bookmarklet <span class=\"beta\">beta</span> </h2>\n" +
    "        <p>\n" +
    "            Drag the link up to your bookmarks toolbar. When you're viewing an article\n" +
    "            landing page, click the bookmark. If we can find open fulltext for it anywhere,\n" +
    "            we'll redirect you there.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <span class=\"instructions\">\n" +
    "                Drag this link to your bookmarks toolbar:\n" +
    "            </span>\n" +
    "            <a class=\"bookmarklet-link\" href=\"javascript:(function () {var jsCode = document.createElement('script'); jsCode.setAttribute('src', '//oadoi.org/browser-tools/bookmarklet.js');document.body.appendChild(jsCode);  }());\">oaDOI it</a>\n" +
    "        </p>\n" +
    "\n" +
    "\n" +
    "        <p>\n" +
    "            The tool is in beta right now, so we're really interested in your feedback.\n" +
    "            <a href=\"mailto:team@impactstory.org\">Drop us a line</a> with bug reports\n" +
    "            and feature ideas!\n" +
    "        </p>\n" +
    "\n" +
    "    -->\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("faq.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("faq.tpl.html",
    "<div class=\"page faq\">\n" +
    "    <h1>Frequently asked questions</h1>\n" +
    "\n" +
    "    <dl>\n" +
    "\n" +
    "        <dt id=\"data-sources\">Where does your data come from?</dt>\n" +
    "        <dd>\n" +
    "            We use a number of different data sources to find open versions of articles\n" +
    "            (or in many cases, to determine that the articles are open already):\n" +
    "            <ul>\n" +
    "                <li>The <a href=\"https://doaj.org/\">Directory of Open Access Journals</a> to see if it’s in their index of OA journals.</li>\n" +
    "                <li><a href=\"http://crossref.org/\">CrossRef’s</a> license metadata field, to see if the publisher has reported an open license.</li>\n" +
    "                <li>Our own custom list DOI prefixes, to see if it's in a known preprint repository.</li>\n" +
    "                <li><a href=\"http://datacite.org/\">DataCite</a>, to see if it’s an open dataset.</li>\n" +
    "                <li>The wonderful <a href=\"https://www.base-search.net/\">BASE OA search engine</a> to see if there’s a Green OA copy of the article.\n" +
    "                BASE indexes 90mil+ open documents in 4000+ repositories by harvesting OAI-PMH metadata.</li>\n" +
    "                <li>Repository pages directly, in cases where BASE was unable to determine openness.</li>\n" +
    "                <li>Journal article pages directly, to see if there’s a free PDF link (this is great for detecting hybrid OA)</li>\n" +
    "            </ul>\n" +
    "        </dd>\n" +
    "\n" +
    "\n" +
    "        <dt id=\"creators\">Who is behind oaDOI?</dt>\n" +
    "        <dd>\n" +
    "            We're <a href=\"http://impactstory.org/about\">Impactstory,</a>\n" +
    "            a nonprofit working to make science more open and reusable online.\n" +
    "\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"funding\">How is oaDOI funded?</dt>\n" +
    "        <dd>\n" +
    "            Impactstory is supported by grants from <span class=\"funders\">\n" +
    "            the National Science Foundation and the Alfred P. Sloan Foundation.</span> We'll be supporting\n" +
    "            oaDOI as spinoff of existing projects for the next year, but we're looking for additional funding to expand the\n" +
    "            service even further. Possible models include grants and Service-Level Agreements with\n" +
    "            data users. No matter what funding models we end up with, the API will always remain free and open.\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"different-results-from-unpaywall\">Why does the Unpaywall extension sometimes give different results from oaDOI?</dt>\n" +
    "        <dd>\n" +
    "            Our Unpaywall browser extension uses oaDOI to find fulltext whenever you run into paywalled articles.\n" +
    "            It supplements oaDOI with other data sources, too; for instance,\n" +
    "            Unpaywall tries to parse and understand scholarly article pages\n" +
    "            as you view them. Consequently,\n" +
    "             Unpaywall's results are a bit more comprehensive than what you'd get by calling oaDOI directly.\n" +
    "        </dd>\n" +
    "\n" +
    "        <dt id=\"report-bugs\">I found a bug</dt>\n" +
    "        <dd>\n" +
    "            Sorry about that! The problem may be that a given repository is not yet\n" +
    "            <a href=\"https://www.base-search.net/about/en/about_sources_date.php?menu=2&submenu=1\">indexed by BASE</a>\n" +
    "            (which is where most of our Green OA information comes from). Then there's also typos,\n" +
    "            dead links,  inconsistent formatting, and other gotchas.\n" +
    "            The good news is, we're getting better all the\n" +
    "            time, and your feedback helps. When you find errors, please let us know by\n" +
    "            <a href=\"https://goo.gl/forms/kFZUUZUeM9ze9uXr2\" target=\"_blank\" >completing this form.</a>\n" +
    "             From there it'll go in our bug\n" +
    "            queue. We'll drop you a line when it's fixed.\n" +
    "        </dd>\n" +
    "\n" +
    "    </dl>\n" +
    "\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("footer.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("footer.tpl.html",
    "<div class=\"page-footer\">\n" +
    "    <div class=\"by\">\n" +
    "        Made with <i class=\"fa fa-heart-o\"></i> by\n" +
    "        <a href=\"http://impactstory.org/about\">Impactstory.</a>\n" +
    "    </div>\n" +
    "    <div class=\"spacer\"></div>\n" +
    "    <div class=\"links\">\n" +
    "        <a href=\"mailto:team@impactstory.org\">\n" +
    "            <i class=\"fa fa-envelope-o\"></i>\n" +
    "            <span class=\"text\">email</span>\n" +
    "        </a>\n" +
    "        <a href=\"http://twitter.com/oadoi_org\">\n" +
    "            <i class=\"fa fa-twitter\"></i>\n" +
    "            <span class=\"text\">twitter</span>\n" +
    "        </a>\n" +
    "        <a href=\"https://github.com/Impactstory/oadoi\">\n" +
    "            <i class=\"fa fa-github\"></i>\n" +
    "            <span class=\"text\">github</span>\n" +
    "        </a>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("landing.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("landing.tpl.html",
    "<div class=\"page landing\">\n" +
    "    <div class=\"content\">\n" +
    "        <div class=\"main-banner\">\n" +
    "            <div class=\"tagline\">\n" +
    "                Find fulltext for scholarly articles.\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"subtagline\">\n" +
    "                We index 90 million articles and deliver open-access\n" +
    "                fulltext versions over a free, fast, open API.\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"info\">\n" +
    "            <p>\n" +
    "                Our data powers\n" +
    "                <a href=\"http://unpaywall.org\">Unpaywall,</a> a free browser extension that lets you\n" +
    "                bypass paywalls on scholarly articles. <a href=\"http://unpaywall.org\">Give it a try.</a>\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                For libraries, we support an <a href=\"http://blog.impactstory.org/oadoi-in-sfx/\">SFX integration</a>\n" +
    "                that finds open fulltext when there's\n" +
    "                no subscription access; more than 600 libraries use it worldwide.\n" +
    "            </p>\n" +
    "\n" +
    "            <p>\n" +
    "                Want to build on our data? Awesome! We handle a million calls a\n" +
    "                week and we'd love to add yours. Check out the\n" +
    "                <a href=\"/api\">API documentation.</a>\n" +
    "            </p>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("sfx.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sfx.tpl.html",
    "<h1>SFXY!</h1>");
}]);

angular.module("sla.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("sla.tpl.html",
    "<div class=\"page sla\">\n" +
    "    <h1>Service-Level Agreement</h1>\n" +
    "    <p>\n" +
    "        Interested in commercial reuse of data from oaDOI? Check out our\n" +
    "        Service-Level Agreement (SLA). Here are the benefits:\n" +
    "    </p>\n" +
    "    <ul>\n" +
    "        <li>\n" +
    "            You can download our whole database as a single file, and use it for\n" +
    "            commercial purposes.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You can get weekly updates on what changed in the oaDOI database. So, if you start\n" +
    "            with the download file, then subscribe to the weekly updates, you'll be able to\n" +
    "            maintain an exact copy of our database, on your own local servers.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You'll get enterprise-level service and support established and guaranteed in writing.\n" +
    "        </li>\n" +
    "        <li>\n" +
    "            You help support oaDOI and keep it sustainable over the long term.\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <p>\n" +
    "        Of course, if you don't need  these features,\n" +
    "        you can always just use the\n" +
    "        <a href=\"api\">API;</a> it's free to everyone for\n" +
    "        any use, and always will be.\n" +
    "    </p>\n" +
    "\n" +
    "    <p>\n" +
    "        Our pricing on the SLA is flexible, depending on your revenue and use-case.\n" +
    "        So if you're interested, please <a href=\"mailto:team@impactstory.org\">contact us;</a>\n" +
    "        we'd love to hear from you!\n" +
    "\n" +
    "\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("team.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("team.tpl.html",
    "<div class=\"page team\">\n" +
    "    <h1>Team</h1>\n" +
    "    <p>\n" +
    "        oaDOI is being built at <a href=\"http://impactstory.org\">Impactstory</a>\n" +
    "        by <a href=\"http://twitter.com/researchremix\">Heather Piwowar<a/> and\n" +
    "        <a href=\"http://twitter.com/jasonpriem\">Jason Priem</a>, funded by the Alfred P. Sloan foundation.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        We'd like to thank all of the people who've worked on earlier projects\n" +
    "        (<a href=\"http://ananelson.github.io/oacensus/\">OA Census</a>,\n" +
    "        <a href=\"https://github.com/CottageLabs/OpenArticleGauge\">Open Article Gauge</a>,\n" +
    "        <a href=\"http://dissem.in/\">Dissemin</a>,\n" +
    "        <a href=\"https://cottagelabs.com/ \">Cottage Labs</a>, and the\n" +
    "        <a href=\"https://openaccessbutton.org/\">Open Access Button</a>)\n" +
    "        for sharing ideas in conversations and open source code -- in particular <a href=\"http://doai.io/\">DOAI</a>\n" +
    "        for inspiring the DOI resolver part of this project.  Thanks also to <a href=\"/about\"> the\n" +
    "        data sources</a> that make oaDOI possible.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        All of the code behind oaDOI is <a href=\"http://github.com/impactstory/oadoi\">open source on GitHub</a>.\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Questions or ideas?  You can reach us at <a href=\"mailto:team@impactstory.org\">team@impactstory.org</a>\n" +
    "        or <a href=\"http://twitter.com/oadoi_org\">@oadoi_org</a>.\n" +
    "    </p>\n" +
    "</div>\n" +
    "");
}]);

angular.module("unpaywall.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("unpaywall.tpl.html",
    "<h1>unpaywall!</h1>");
}]);
