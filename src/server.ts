import * as nanoexpress from 'nanoexpress';
import IPList from "./ip_list";

const app = nanoexpress();
const ipLists = new IPList()

// Get all IP and Subnets in memory
ipLists.updateList();

/**
 * [POST] check_ips endpoint providing payload as JSON {ips: [Array of IP addresses]} returns array of blockedIPs
 */
app.post('/check_ips', (req, res) => {
  if (req.headers.authorization !== `Bearer ${process.env.API_KEY}`) {
    res.status(403)
    return res.send("Unauthorized")
  }
  const blockedIPs = []
  let ips = JSON.parse(req.body.toString()).ips
  ips = ips.filter((v, i, a) => a.indexOf(v) === i);
  for (let ip of ips) {
    ip = ip.trim()
    if (ipLists.isIPinList(ip)) {
      blockedIPs.push(ip)
    }
  }
  return res.send({blockedIPs});
});

/**
 * [GET] update_ip_list endpoint with query parameter api_key to update the list from github repo (Called from crontab)
 */
app.get('/update_ip_list', (req, res) => {
  if (req.query.api_key !== process.env.API_KEY) {
    res.status(403)
    return res.send("Unauthorized")
  }
  void ipLists.downloadLists()
  return res.send({ok: 'true'});
});

app.listen(3000, '0.0.0.0').catch((err) => {
  console.log(err)
})
