# Developer blog

I have a blog currently running on https://blog.derlin.ch and using hashnode. Hashnode is dying, and I want to move away from it.
My goal is to have a static site generator for my blog, easy to update and write to.

I exported all the articles in json format and downloaded all the images referenced in the articles in ../hashnode-backup/hashnode_complete_backup.json.
The JSON were extracted using the hashnode API: https://gql.hashnode.com and are separated between drafts and posts (published).
They contain metadata, and the actual content in markdown and html (under "markdown").
The assets (images) are in ../hashnode-backup/hashnode_assets/(drafts|posts)/<article_id>.
For more information on the structure, the scripts used to extract the information are ../hashnode-backup/export.py and ../hashnode-backup/download_images_per_id.py

The stack doesn't matter much, as long as it is maintained, easy, and provides all the features required. The style is the most important.
Ideally, it would look similar to what I have currently. 

## UI

I have screenhosts of the main listing (main-page.png) and for articles (article.png and article-2.png).

- simple, clean UI
- search feature

main page:
- article excerpts sorted by published date, descending
- excerpts contain title, publication date, cover image, first few sentences of the article

article:
- simple layout, easy to read
- cover image at the top
- centered layout

## edition

- articles are written in markdown
- features: regular markdown + code blocks with syntax highlight, callout, possibility to control the width and align of the images in the markdown
- all the current markdowns (exported from hashnode) should work -> have a look at the features used there for coverage
- images should ideally be placed in the same folder than the markdown article (if possible) and with meaningful names
- live reload feature to see the preview easily during editing

