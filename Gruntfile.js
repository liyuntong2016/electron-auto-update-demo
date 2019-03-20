var grunt=require('grunt');

//配置
grunt.config.init({
    pkg: grunt.file.readJSON('gruntPackage.json'),
    'create-windows-installer': {
        x64:{
            version:'1.0.0',
            authors:'lyt',
            projectUrl:'',
            appDirectory:'./target/znyts-win32-x64',//要打包的输入目录
            outputDirectory:'./output',//grunt打包后的输出目录
            exe:'znyts.exe',
            title:"某个项目",//程序中文名
            description:'某个项目',
            setupIcon:"favicon.ico",
            loadingGif:"loading.gif",//安装应用时的动画
            noMsi:true
        }
    }
});

//加载任务
grunt.loadNpmTasks('grunt-electron-installer');

//设置为默认
grunt.registerTask('default', ['create-windows-installer']);