/* Bringing missed questions back during practice. No page code.
 *
 * A question you miss returns a few questions later, the same cards, so you have to recall the
 * answer rather than reread it. Get it right then and it returns once more, further on; get that
 * right too and it's done. Miss it again and it starts over.
 */
export function createReview({ soon = 3, later = 8 } = {}) {
	const queue = []; // { q, due, step }
	let answered = 0;
	return {
		/** A question whose turn has come, or null. */
		due() {
			const i = queue.findIndex((x) => x.due <= answered);
			return i < 0 ? null : queue.splice(i, 1)[0];
		},
		/** Record an answer. item is what due() returned for this question, or null for a new one. */
		record(q, right, item) {
			answered++;
			if (!right) queue.push({ q, due: answered + soon, step: 0 });
			else if (item && item.step === 0) queue.push({ q, due: answered + later, step: 1 });
		},
		/** How many questions are waiting to come back. */
		waiting: () => queue.length,
	};
}
