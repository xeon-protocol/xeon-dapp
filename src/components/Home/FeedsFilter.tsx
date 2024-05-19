export default function FeedsFilter() {
  return (
    <div>
      <div className="feedsfilterDockHold">
        <div className="streamtype" id="discoverTab">
          <div className="eventAct">
            <a href="#">Discover</a>
          </div>
        </div>
        <div className="streamtype" id="mypositionsTabs">
          <div className="eventAct">
            <a href="#">Positions</a>
          </div>
        </div>
        <div className="streamtype" id="bookmarksTab">
          <div className="eventAct">
            <a href="#">Bookmarks</a>
          </div>
        </div>
        <button id="create_button" className="neon-button">
          <span className="neon-button-icon">+</span>
        </button>
        <div className="sitesearchhold" id="feedsearchhold">
          <form id="swap_searcher" action="" method="post">
            <input
              type="submit"
              id="searchaddress"
              className="site_search_btn"
              value=""
            />
            <input
              id="searchBar"
              className="search-input"
              type="text"
              name="search"
              placeholder=" filter token address.."
            />
          </form>
          <div id="searchresult"></div>
        </div>
      </div>
    </div>
  );
}
