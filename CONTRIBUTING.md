# Contributing guidelines

We love contributors and people willing to help.

## How can you help?

* Fix typos and grammar
* Add new or improve existing [locations](locations.json)
* Request new locations

## Contributing procedure

* Fork this repository over GitHub
* Create a separate branch, for instance `patch-1`, so you will not need to
  rebase your fork if your master branch is merged

  ```bash
  git clone git@github.com:your_username/php-lands
  cd php-lands
  git checkout -b patch-1
  ```
* Make changes, commit them and push to your fork

  ```bash
  git add .
  git commit -m "Fix typo"
  git push origin patch-1
  ```
* Open a new pull request

## Local installation

The website for the PHP lands map is built with GitHub pages.

You can setup site locally with Docker and provided Makefile:

```bash
make up
```
