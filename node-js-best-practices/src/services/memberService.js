const Member = require('../database/Member');

const getRecordForMember = (memberId) => {
	try {
		const record = Member.getRecordForMember(memberId);
		return record;
	} catch (error) {
		throw error;
	}
};
module.exports = { getRecordForMember };
