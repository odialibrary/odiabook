<script type='text/javascript'>
/*<![CDATA[*/
var postperpage = 9;   // Posts per page
var numshowpage = 3;   // How many middle numbers
var upPageWord = '« Previous Page';
var downPageWord = 'Next Page »';
var urlactivepage = location.href;
var home_page = "/";

var nopage, jenis, nomerhal, lblname1, searchQuery, totalPages;

// Auto-redirect homepage to ensure max-results = postperpage
(function() {
  if (location.pathname === "/" && location.search.indexOf("max-results") === -1) {
    location.href = home_page + "?max-results=" + postperpage;
  } else {
    halamanblogger();
  }
})();

function loophalaman(banyakdata) {
  var html = '';
  var nomerkiri = parseInt(numshowpage / 2, 10);
  if (nomerkiri == numshowpage - nomerkiri) { numshowpage = nomerkiri * 2 + 1; }
  var mulai = nomerhal - nomerkiri;
  if (mulai < 1) mulai = 1;

  var maksimal = Math.ceil((banyakdata || 0) / postperpage);
  var akhir = mulai + numshowpage - 1;
  if (akhir > maksimal) akhir = maksimal;
  totalPages = maksimal;

  if (maksimal < 2) {
    var pageArea0 = document.getElementsByName("pageArea");
    for (var p0 = 0; p0 < pageArea0.length; p0++) pageArea0[p0].innerHTML = '';
    var blogPager0 = document.getElementById("blog-pager");
    if (blogPager0) blogPager0.innerHTML = '';
    return;
  }

  if (nomerhal > 1) html += pageLink(nomerhal - 1, upPageWord);

  if (mulai > 1) {
    html += pageLink(1, "1");
    if (mulai > 2) html += " ... ";
  }

  for (var jj = mulai; jj <= akhir; jj++) {
    if (nomerhal == jj) html += '<span class="showpagePoint">' + jj + '</span>';
    else html += pageLink(jj, jj);
  }

  if (akhir < maksimal - 1) html += " ... ";
  if (akhir < maksimal) html += pageLink(maksimal, maksimal);

  if (nomerhal < maksimal) html += pageLink(nomerhal + 1, downPageWord);

  var pageArea = document.getElementsByName("pageArea");
  for (var p = 0; p < pageArea.length; p++) pageArea[p].innerHTML = html;
  if (pageArea && pageArea.length > 0) html = '';
  var blogPager = document.getElementById("blog-pager");
  if (blogPager) blogPager.innerHTML = html;
}

function pageLink(pageNo, text) {
  if (jenis == "page") {
    if (pageNo == 1) return '<span class="showpageNum"><a href="' + home_page + '?max-results=' + postperpage + '">' + text + '</a></span>';
    return '<span class="showpageNum"><a href="#" onclick="redirectpage(' + pageNo + ');return false">' + text + '</a></span>';
  } else if (jenis == "label") {
    if (pageNo == 1) return '<span class="showpageNum"><a href="/search/label/' + encodeURIComponent(lblname1) + '?max-results=' + postperpage + '">' + text + '</a></span>';
    return '<span class="showpageNum"><a href="#" onclick="redirectlabel(' + pageNo + ');return false">' + text + '</a></span>';
  } else if (jenis == "search") {
    if (pageNo == 1) return '<span class="showpageNum"><a href="/search?q=' + encodeURIComponent(searchQuery) + '&max-results=' + postperpage + '">' + text + '</a></span>';
    return '<span class="showpageNum"><a href="#" onclick="redirectsearch(' + pageNo + ');return false">' + text + '</a></span>';
  }
  return "";
}

function hitungtotaldata(root) {
  if (!root || !root.feed || !root.feed.openSearch$totalResults) return;
  var totaldata = parseInt(root.feed.openSearch$totalResults.$t, 10) || 0;
  loophalaman(totaldata);
}

function halamanblogger() {
  var thisUrl = urlactivepage;
  if (thisUrl.indexOf("/search/label/") !== -1) {
    jenis = "label";
    lblname1 = thisUrl.split("/search/label/")[1].split("?")[0];
  } else if (thisUrl.indexOf("/search?q=") !== -1) {
    jenis = "search";
    searchQuery = decodeURIComponent(thisUrl.split("/search?q=")[1].split("&")[0]);
  } else {
    jenis = "page";
  }

  if (urlactivepage.indexOf("#PageNo=") !== -1) {
    nomerhal = parseInt(urlactivepage.substring(urlactivepage.indexOf("#PageNo=") + 8), 10);
  } else {
    nomerhal = 1;
  }

  var feedUrl = home_page + "feeds/posts/summary?max-results=0&alt=json-in-script&callback=hitungtotaldata";
  if (jenis == "label") feedUrl = home_page + "feeds/posts/summary/-/" + encodeURIComponent(lblname1) + "?alt=json-in-script&callback=hitungtotaldata&max-results=0";
  else if (jenis == "search") feedUrl = home_page + "feeds/posts/summary?q=" + encodeURIComponent(searchQuery) + "&alt=json-in-script&callback=hitungtotaldata&max-results=0";

  var s = document.createElement('script');
  s.src = feedUrl;
  document.getElementsByTagName('head')[0].appendChild(s);
}

function redirectpage(numberpage) {
  var jsonstart = (numberpage - 1) * postperpage + 1;
  nopage = numberpage;
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = home_page + "feeds/posts/summary?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
  document.getElementsByTagName('head')[0].appendChild(s);
}

function redirectlabel(numberpage) {
  var jsonstart = (numberpage - 1) * postperpage + 1;
  nopage = numberpage;
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = home_page + "feeds/posts/summary/-/" + encodeURIComponent(lblname1) + "?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
  document.getElementsByTagName('head')[0].appendChild(s);
}

function redirectsearch(numberpage) {
  var jsonstart = (numberpage - 1) * postperpage + 1;
  nopage = numberpage;
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = home_page + "feeds/posts/summary?q=" + encodeURIComponent(searchQuery) + "&start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost";
  document.getElementsByTagName('head')[0].appendChild(s);
}

function finddatepost(root) {
  if (!root || !root.feed || !root.feed.entry || !root.feed.entry[0]) return;
  var post = root.feed.entry[0];
  var timestamp1 = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
  var timestamp = encodeURIComponent(timestamp1);
  var alamat = "";
  if (jenis == "page") alamat = "/search?updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
  else if (jenis == "label") alamat = "/search/label/" + encodeURIComponent(lblname1) + "?updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
  else if (jenis == "search") alamat = "/search?q=" + encodeURIComponent(searchQuery) + "&updated-max=" + timestamp + "&max-results=" + postperpage + "#PageNo=" + nopage;
  location.href = alamat;
}
/*]]>*/
</script>
