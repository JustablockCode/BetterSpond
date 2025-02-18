(function () {
  const darkModeStyles = `
    /* General Dark Mode Styles */
    html, body {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Header Styling */
    #pageContentWrapper.spondHeaderstyled__SpondHeaderBed-sc-1xs7cs-0,
    .spondHeaderstyled__SpondHeaderBar-sc-1xs7cs-2,
    .spondHeaderstyled__Branding-sc-1xs7cs-5,
    .spondHeaderstyled__Controls-sc-1xs7cs-4 {
      background-color: #1f1f1f !important;
      color: #e0e0e0 !important;
    }

    .spondHeaderstyled__TabItem-sc-1xs7cs-7,
    .spondHeaderstyled__TabItemText-sc-1xs7cs-8,
    .spondHeaderstyled__TabItemIcon-sc-1xs7cs-9 {
      color: #e0e0e0 !important;
      fill: #e0e0e0 !important;
    }

    .spondHeaderstyled__SpondLogo-sc-1xs7cs-10 {
      filter: brightness(0) invert(1);
    }

    /* Event Cards */
    .spondCardstyled__SpondCardBed-sc-1adg5oi-0 {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }
    .spondCardstyled__SpondCardBed-sc-1adg5oi-0 * {
      color: #e0e0e0 !important;
      background-color: transparent !important;
    }

    /* Links */
    a {
      color: #e0e0e0 !important;
    }

    /* Right Column */
    .commonStyled__RightColumn-sc-1mqdw97-10,
    .commonStyled__RightColumnCard-sc-1mqdw97-11,
    .homestyled__RightTextBed-sc-nlarjk-3,
    .homestyled__RightDescription-sc-nlarjk-5 {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }

    /* Buttons */
    .buttonstyled__ButtonBed-sc-197tf8c-0 {
      background-color: #333 !important;
      color: #e0e0e0 !important;
      border-radius: 8px !important;
      padding: 10px 15px !important;
    }

    /* Tab Bar */
    .entitiesTabBarstyled__EntitiesTabBarBed-sc-nu9o4u-0,
    .entitiesTabBarstyled__MenuBed-sc-nu9o4u-13,
    .entitiesTabBarstyled__ColumnBed-sc-nu9o4u-14,
    .entitiesTabBarstyled__Column-sc-nu9o4u-17 {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }

    .entitiesTabBarstyled__ColumnText-sc-nu9o4u-2 {
      color: #e0e0e0 !important;
    }

    /* Top Menu Bar */
    .top-menu-action-bar-component,
    .menu-wrapper,
    .context-menu-item {
      background-color: #1a1a1a !important;
      color: #e0e0e0 !important;
    }

    /* Entity Details Section */
    .entityDetailsstyled__SpondContentBed-sc-eff49t-20 {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    .entityDetailsstyled__SpondBodySection-sc-eff49t-24 {
      border-bottom: 1px solid #333 !important;
    }

    .entityDetailsstyled__SpondBodyRowText-sc-eff49t-46 {
      color: #e0e0e0 !important;
    }

    .entityDetailsstyled__SpondBodyRowSubText-sc-eff49t-48 {
      color: #b0b0b0 !important;
    }

    /* Comments Section */
    .commentsstyled__CommentsBed-sc-187j9be-0 {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    .commentsstyled__CommentTextBed-sc-187j9be-34 {
      color: #e0e0e0 !important;
    }

    .commentsstyled__CommentSenderName-sc-187j9be-36 {
      color: #e0e0e0 !important;
    }

    .commentsstyled__CommentText-sc-187j9be-37 {
      color: #b0b0b0 !important;
    }

    .commentsstyled__AddCommentBed-sc-187j9be-28 {
      background-color: #1e1e1e !important;
      border-top: 1px solid #333 !important;
    }

    /* Post Details Section */
    .postDetailsstyled__PostDetailsBed-sc-1edi0e8-0 {
      background-color: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    .postDetailsstyled__PostBody-sc-1edi0e8-4 {
      color: #e0e0e0 !important;
    }

    .postDetailsstyled__NameText-sc-1edi0e8-8 {
      color: #e0e0e0 !important;
    }

    .postDetailsstyled__GroupText-sc-1edi0e8-12 {
      color: #b0b0b0 !important;
    }

    .postDetailsstyled__CountSectionBed-sc-1edi0e8-22 {
      border-top: 1px solid #333 !important;
    }

    /* Emojis and Reactions */
    .emojisPopoverstyled__EmojisPopoverBed-sc-axgp6r-0 {
      background-color: #333 !important;
      color: #e0e0e0 !important;
    }

    .emojisPopoverstyled__EmojiItem-sc-axgp6r-7 {
      color: #e0e0e0 !important;
    }

    .emojisPopoverstyled__EmojiItemCount-sc-axgp6r-8 {
      color: #b0b0b0 !important;
    }

    /* Tooltips */
    .__react_component_tooltip {
      background-color: #333 !important;
      color: #e0e0e0 !important;
    }

    .__react_component_tooltip.place-top::after {
      border-top-color: #333 !important;
    }

    .__react_component_tooltip.place-bottom::after {
      border-bottom-color: #333 !important;
    }

    .__react_component_tooltip.place-left::after {
      border-left-color: #333 !important;
    }

    .__react_component_tooltip.place-right::after {
      border-right-color: #333 !important;
    }
    
    /* Dark Mode Styles for the Tab Bar */
    .groupDetailsstyled__GroupTabBarBed-sc-1tba6ic-9 {
      background-color: #1a1a1a !important; /* Dark background for the tab bar */
      border-bottom: 1px solid #333 !important; /* Add a subtle border */
    }

    .groupDetailsstyled__GroupNav-sc-1tba6ic-10 {
      background-color: transparent !important; /* Transparent background for the nav */
    }

    .groupDetailsstyled__GroupNavItem-sc-1tba6ic-11 {
      color: #e0e0e0 !important; /* Light text color for inactive tabs */
      background-color: transparent !important; /* Transparent background for tabs */
    }

    .groupDetailsstyled__GroupNavItem-sc-1tba6ic-11:hover {
      background-color: #333 !important; /* Darker background on hover */
    }

    .groupDetailsstyled__GroupNavItemInner-sc-1tba6ic-14 {
      color: #e0e0e0 !important; /* Light text color for tab text */
    }

    .groupDetailsstyled__GroupNavItemSeperator-sc-1tba6ic-13 {
      background-color: #333 !important; /* Dark separator color */
    }

    /* Active Tab Styling */
    .groupDetailsstyled__GroupNavItem-sc-1tba6ic-11.active {
      background-color: #444 !important; /* Slightly lighter background for active tab */
      color: #ffffff !important; /* Bright white for active tab text */
    }

    /* More Button Styling */
    .groupDetailsstyled__GroupMoreButtonsBed-sc-1tba6ic-15 {
      background-color: transparent !important; /* Transparent background for the "more" button */
    }

    .buttonstyled__ButtonBed-sc-197tf8c-0 {
      background-color: #333 !important; /* Dark background for the button */
      color: #e0e0e0 !important; /* Light text color for the button */
      border-radius: 4px !important; /* Rounded corners */
    }

    .buttonstyled__ButtonBed-sc-197tf8c-0:hover {
      background-color: #444 !important; /* Darker background on hover */
    }
  `;

  function applyDarkMode() {
    let styleElement = document.getElementById('dark-mode-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'dark-mode-styles';
      styleElement.textContent = darkModeStyles;
      document.head.appendChild(styleElement);
    }
  }

  function initDarkMode() {
    applyDarkMode();
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          applyDarkMode();
        }
      }
    });
    observer.observe(document.body, {
      childList: true, 
      subtree: true,
    });
  }

  window.addEventListener('load', initDarkMode);
})();