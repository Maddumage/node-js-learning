const DB = require('./db.json');

const getRecordForMember = (memberId) => {
	try {
		const record = DB.records.filter(
			(record) => record.memberId === memberId
		);
		if (!record) {
			throw {
				status: 400,
				message: `Can't find workout with the id '${memberId}'`,
			};
		}
		return record;
	} catch (error) {
		throw {
			status: error?.status || 500,
			message: error?.message || error,
		};
	}
};
module.exports = { getRecordForMember };
