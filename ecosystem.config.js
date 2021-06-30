module.exports = {
  apps: [{
    name: "IP_BAN",
    script: 'build/server.js',
    exec_mode: 'cluster_mode',
    instances: 'max',
    exp_backoff_restart_delay: 100,
    env: {
      "API_KEY": "API_KEY",
    },
  }]
}
