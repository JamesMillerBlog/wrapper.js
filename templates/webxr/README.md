# WebXR
This repository is a template from the Wrapper.js library.

## How to commit to this repo
You can either create a branch and raise a PR as you would any other repository, or you can make changes directly in the Wrapper.js Repository.

This is possible, as this repository is a subtree of Wrapper.js, subtree commands to remember are:
- The command to add a subtree to a repository (necessary on initial creation only): ```git subtree add --prefix templates/webxr https://github.com/JamesMillerBlog/webxr.git main --squash```
- The command to add a remote to the repository: ```git remote add -f webxr https://github.com/JamesMillerBlog/webxr.git```
- The command to fetch webxr main branch: ```git fetch webxr main```
- The command to pull webxr main branch: ```git subtree pull --prefix templates/webxr webxr main --squash```
- The command to push to webxr main branch: ```git subtree push --prefix templates/webxr webxr main```
