// get hosted zones, group domains by HZ.Id using .reduce and extract values
const groupDomainsByHostedZone = async (serverless, domains) => {
    const r53response = await serverless.getProvider('aws').request('Route53', 'listHostedZones', {});
    // we only want raw Ids
    const hostedZones = r53response.HostedZones.map(hz => ({...hz, Id: hz.Id.split("/").reverse()[0]}));

    const hostedZoneMap = domains.reduce((accumulator, domain) => {
        const hostedZone = hostedZones.find(hostedZone => `${domain}.`.includes(hostedZone.Name));
        if (accumulator[hostedZone?.Id]) accumulator[hostedZone?.Id].domains.push(domain);
        else accumulator[hostedZone?.Id] = {...hostedZone, domains: [domain]};
        return accumulator;
    }, {});
    return Object.values(hostedZoneMap);
}

module.exports = {
    groupDomainsByHostedZone
};
