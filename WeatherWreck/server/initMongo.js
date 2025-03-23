db = db.getSiblingDB('WeatherWreck');

db.createUser({
	user: 'manager',
	pwd: 'manager123',
	roles: [
	{ role: 'readWrite', db:'WeatherWreck'}
]
});

