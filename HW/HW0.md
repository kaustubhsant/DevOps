# Git Basics #
## Introduction Sequence ##
### Level intro1 ###
	
	git commit -m "C2"
	git commit -m "C3"

### Level intro2 ###
	
	git branch bugFix
	git checkout bugFix

### Level intro3 ###
	
	git branch bugFix
	git checkout bugFix
	git commit -m "C2"
	git checkout master
	git commit "C3"
	git merge bugFix

### Level intro4 ###
	
	git branch bugFix
	git checkout bugFix
	git commit -m "C2"
	git checkout master
	git commit -m "C3"
	git checkout bugFix
	git rebase master

## Ramping up ##
### Level ramup1 ###
	
	git checkout C4

### Level ramup2 ###
	
	git checkout bugFix^

### Level ramup3 ###
	
	git branch -f bugFix HEAD~2
	git branch -f master C6
	git checkout HEAD^

### Level ramup4 ###
	
	git reset local^
	git checkout pushed
	git revert pushed

![Git Basics](/HW0-git-basics.png)

# Hooks #
content in "post-commit" file in ".git/hooks/":

	!#/bin/bash
	start "http://www.google.com"
