# WP Content Checklist

## What

Provides tools for managing content consistently, automating changes and checks

## Who

Anyone with a sufficiently large body of content they're looking to manage on an ongoing basis. I'm personally building this tool to help me massage my 400+ posts for better SEO.

## How

1. Get the code
2. Run `npm build` or `yarn build` to build the client in the `wp-content-checklist/dist` directory
3. Add `content-checklist/index.php` and `wp-content-checklist/dist` to your plugins directory
4. Enable the plugin
5. Add your column(s)
6. Add your fix and check hooks to your theme's functions.php
