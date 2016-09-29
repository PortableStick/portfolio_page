var plan = require('flightplan');

plan.target('setup', {
    host: "mysupertestsite.com",
    username: "gregorysmith",
    agent: process.env.SSH_AUTH_SOCK
});

plan.target('staging', {
    host: "mysupertestsite.com",
    username: "gregorysmith",
    agent: process.env.SSH_AUTH_SOCK
}, {
    webRoot: "/usr/local/var",
    ownerUser: "gregorysmith",
    group: "admin"
});

plan.target('deployment', {
    host: "www.shadesofmarkup.com",
    username: "admin",
    agent: process.env.SSH_AUTH_SOCK
}, {
    webRoot: "/usr/local/var",
    ownerUser: "admin",
    group: "admin"
});

var versionedDir = `${new Date().getTime()}`;

plan.remote('setup', function(remote) {
    remote.with('cd /usr/local/var', function() {
        remote.mkdir('portfolio-page');
        remote.mkdir('~/portfolio-page')
    });
});

plan.local(['staging', 'deployment'], function(local) {
    local.log("Running local flightplan");

    var filesToTransfer = local.exec('find dist', {silent: true})
                    .stdout.split('\n')
                    .map(function(file) {
                        var newName = file.slice(5);
                        return newName;
                    })
                    .filter(function(file) {
                        return file.length > 0 && file !== ".DS_Store";
                    });
    local.log("Moving files");
    local.with(`cd dist`, function() {
        local.transfer(filesToTransfer, `~/portfolio-page`);
    });
});

plan.remote(['staging', 'deployment'], function(remote) {
    remote.hostname();
    remote.log("Remoting!");
    remote.exec(`cp -R ~/portfolio-page ${plan.runtime.options.webRoot}/portfolio-page/${versionedDir}`)
    remote.exec(`chown -R ${plan.runtime.options.ownerUser}:${plan.runtime.options.group} ${plan.runtime.options.webRoot}/portfolio-page/${versionedDir}`);
    remote.with(`cd ${plan.runtime.options.webRoot}/portfolio-page`, function() {
        remote.exec('rm current');
        remote.exec(`ln -s ${versionedDir} current`);
    });
});
