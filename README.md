# nyc-capital-budget-site

An express.js website with react view templates for exploring NYC Capital Budget Data

[https://nyc-capital-budget.chriswhong.com](https://nyc-capital-budget.chriswhong.com)

<img width="1198" alt="Budget_Line_Timeline_and_surf-the-budget_—_node_◂_node____nvm_versions_node_v12_1_0_bin_yarn_dev_—_123×34" src="https://user-images.githubusercontent.com/1833820/66973444-06a02600-f066-11e9-964f-8bfdfac27e0a.png">

## Why?

There is a lot of information about budget and spending that is ostensibly public, but not easy to access.  Most of it is locked up in PDFs which contain computer-generated reports.  A simple goal of this project is to create a persistent URL for each NYC budget line, and to show a multi-year picture of money appropriated and spent.  Another way to put it is that looking at an individual fiscal year's budget only tells you a small part of the story, many projects and budget lines exist on a decade or longer horizon.

## Data

All data are from publicly available sources, specifically the [Office of Management and Budget Online Publications](https://www1.nyc.gov/site/omb/publications/publications.page) (PDFs).  We have scraped the adopted capital budget and the capital commitment plan for all years since fiscal year 2008.  [Code for the scrapers is on Github](https://github.com/chriswhong/capital-budget-scrape).

## Overview & Technical Terms

The top level route shows a breakdown of "project types".  All Capital **Budget Lines** fall into one project type, which is prefixed in the budget line id. e.g. Budget Line **CO-296** has a project type of **CO** for "Courts".  Budget Lines are the units into which funds are appropriated.

Each year, the capital budget is released which specifies appropriations that may take place the same year, or over the following 3 fiscal years.  Budget Lines are "high level" buckets of money assigned for a specific purpose, but money is actually spend on **Projects**.  

The capital budget does not include any information on capital projects.  The capital commitment plan is the city's plan to spend money which has been appropriated, and includes specific lists of projects connected to each budget line.  So, with full data from the capital budget and the capital commitment plan, we can see:

- Available Balance over time for a Budget Line
- Appropriations and rescindments made each year for a Budget Line
- Capital Projects associated with each Budget Line (ids and descriptions, and plans to spend money, but not actual money spent)

Given a capital project id, it is possible to look up associated spending Checkbook NYC, the comptroller's spending data site.  It's extremely slow, but the data are there.
While 

## Vision

- We can crowdsource the addition of geometries to each budget line and/or projects, and be able to see on a map where projects are taking place around the city

- We can crowdsource the addition of "resources" to budget lines and/or projects, providing links to news articles, city council hearings, community group blogs, etc... context will transform these endless rows of mundane budget data into real things that affect real people.


## Development

- Install dependencies: `yarn`
- Create `.env` file with `MONGO_URI` specified
- Run the development server `yarn dev`

## Contributing

I'd love your help.  Contact me at @chris_whong on twitter, take a look at the open issues, and let me know what you'd like to work on.
