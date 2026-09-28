local helpmsg = [[TWINS LANG
    Hello, welcome to twins. Your language to build a new web
    
    usage:
    twinsc <source> -o output]]

function help()
    print(helpmsg)
end

if arg[1] == "h" then
    help()
end


