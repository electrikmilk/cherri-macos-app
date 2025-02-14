#!/bin/sh

PATH=/usr/bin:/usr/local/bin:/opt/local/bin:/bin:/opt/homebrew/bin:$PATH
hash -r go
hash -r mv

cd Cherri/Compiler
go build
mv cherri ../cherri_binary