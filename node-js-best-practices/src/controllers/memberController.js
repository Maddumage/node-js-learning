const recordService = require('../services/memberService');

const getRecordForMember = (req, res) => {
	const {
		params: { memberId },
	} = req;
	if (!memberId) {
		res.status(400).send({
			status: 'FAILED',
			data: {
				error: "Parameter ':memberId' can not be empty",
			},
		});
	}
	try {
		const records = recordService.getRecordForMember(memberId);
		res.send({ status: 'OK', data: records });
	} catch (error) {
		res.status(error?.status || 500).send({
			status: 'FAILED',
			data: { error: error?.message || error },
		});
	}
};

module.exports = {
	getRecordForMember,
};
