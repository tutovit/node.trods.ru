ps -eo comm |grep -i chrome | xargs -n1 killall -9c
ps -eo comm |grep -i nodejs | xargs -n1 killall -9c
ps axu