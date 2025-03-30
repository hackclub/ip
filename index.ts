import { sql } from "bun";

async function q(ip: string) {
	return await sql`
		select 
			net.network,
			is_anonymous_proxy,
			is_satellite_provider,
			postal_code,
			latitude,
			longitude,
			accuracy_radius,
			is_anycast,
			locale_code,
			continent_code,
			continent_name,
			country_iso_code,
			country_name,
			subdivision_1_iso_code,
			subdivision_1_name,
			subdivision_2_iso_code,
			subdivision_2_name,
			city_name,
			metro_code,
			time_zone,
			is_in_european_union,
			autonomous_system_organization as isp_name
		from geoip2_network net
		left join geoip2_location location on (
			net.geoname_id = location.geoname_id
		)
		left join geoip2_asn asn on (
			asn.network >>= net.network
		)
		where net.network >>= ${ip};`

}

Bun.serve({
	routes: {
		"/ip": async (req, server) => {
			const start = performance.now()
			const ip = server.requestIP(req)
			console.log({ip, req})
			const [ipRes] = await q(ip.address)
			console.log(Math.round(performance.now() - start) + " ms")
			return Response.json(ipRes)

		},
		"/ip/:ip": async ({ params }) => {
			const start = performance.now()
			const [ipRes] = await q(params.ip)
			console.log(Math.round(performance.now() - start) + " ms")
			return Response.json(ipRes)
		}
	}
})

