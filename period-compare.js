/**
 *
 * @author Muhammad Reyhan Abizar
 * @version 1.0
 * @since 11/29/2018
 */

const moment = require('moment');

class Period {
    constructor(start = null, end = null, startFormat = "MM/DD/YYYY", endFormat = "MM/DD/YYYY") {
        if (start == null) {
            throw new Error('Start Date cannot be null');
        }
        if (end == null) {
            throw new Error('End Date cannot be null');
        }
        if (start > end) {
            throw new Error('Invalid Range Date');
        }

        this.start = moment(start, startFormat);
        this.end = moment(end, endFormat);
    }

    length() {
        return this.end.diff(this.start, 'days') + 1;
    }

    equals(period) {
        if (period instanceof Period) {
            return this.start.isSame(period.start) && this.end.isSame(period.end);
        } else {
            throw new Error('period is not an Period object');
        }

    }

    overlapWith(period) {
        if (period instanceof Period) {
            if (this.start > period.end) {
                return false;
            }
            return period.start <= this.end;
        } else {
            throw new Error('period is not an Period object');
        }
    }

    touchesWith(period) {
        if (period instanceof Period) {
            return period.start.diff(this.end, 'days') === 1 || period.end.diff(this.start, 'days') === 1;
        } else {
            throw new Error('period is not an Period object');
        }
    }

    startAfter(date, format = "MM/DD/YYYY") {
        if (!moment.isMoment(date)) {
            date = moment(date, format);
        }
        return this.start > date;
    }

    startBefore(date, format = "MM/DD/YYYY") {
        if (!moment.isMoment(date)) {
            date = moment(date, format);
        }
        return this.start < date;
    }

    endAfter(date, format = "MM/DD/YYYY") {
        if (!moment.isMoment(date)) {
            date = moment(date, format);
        }
        return this.end > date;
    }

    endBefore(date, format = "MM/DD/YYYY") {
        if (!moment.isMoment(date)) {
            date = moment(date, format);
        }
        return this.end < date;
    }

    gap(period) {
        if (period instanceof Period) {
            if (this.overlapWith(period)) {
                return null;
            }

            if (this.touchesWith(period)) {
                return null;
            }

            if (this.start >= period.end) {
                return new Period(
                    period.end.add(1, 'days'),
                    this.start.subtract(1, 'days')
                );
            }
            else {
                return new Period(
                    this.end.add(1, 'days'),
                    period.start.subtract(1, 'days')
                );
            }
        } else {
            throw new Error('period is not an Period object');
        }
    }

    overlapSingle(period) {
        if (period instanceof Period) {
            let start = this.start > period.start ? this.start : period.start;
            let end = this.end < period.end ? this.end : period.end;

            if (start > end) {
                return null;
            }

            return new Period(start, end);
        } else {
            throw new Error('period is not an Period object');
        }
    }

    overlap(...period) {
        let overlapCollection = new PeriodCollection();
        let current = this;
        period.forEach(function (value) {
            overlapCollection.addPeriod(current.overlapSingle(value));
        });

        return overlapCollection;
    }

    overlapAll(...period) {
        let current = this;

        period.forEach(function (value) {
            current = current.overlapSingle(value);
        });

        return current;
    }

    diffSingle(period) {
        if (period instanceof Period) {
            let periodCollection = new PeriodCollection();
            if (!this.overlapWith(period)) {
                periodCollection.addPeriod(this);
                periodCollection.addPeriod(period);

                return periodCollection;
            }

            let overlap = this.overlapSingle(period);
            let start = this.start < period.start ? this.start : period.start;
            let end = this.end > period.end ? this.end : period.end;

            if (overlap.start > start) {
                periodCollection.addPeriod(new Period(start, overlap.start.subtract(1, 'days')));
            }

            if (overlap.end < end) {
                periodCollection.addPeriod(new Period(overlap.end.add(1, 'days'), end));
            }

            return periodCollection;
        } else {
            throw new Error('period is not an Period object');
        }
    }

    diff(...periods) {
        if (periods.length === 1) {
            let periodCollection = new PeriodCollection();

            if (!this.overlapWith(periods[0])) {
                periodCollection.addPeriod(this.gap(periods[0]));
            }
            return periodCollection;
        }

        let diff = [];
        let current = this;

        periods.forEach(function (value) {
            diff.push(current.diffSingle(value));
        });

        console.log("Diff"+typeof diff);

        return (new PeriodCollection(this)).overlap(diff);

    }


}

class PeriodCollection {
    constructor(...periods) {
        this.periods = periods;
    }

    addPeriod(period) {
        this.periods.push(period);
    }

    count() {
        return this.periods.length;
    }

    get(index) {
        return this.periods[index];
    }

    overlapSingle(periodCollection) {
        if (periodCollection instanceof PeriodCollection) {
            let overlaps = new PeriodCollection();
            this.periods.forEach(function (period) {
                periodCollection.periods.forEach(function (otherPeriod) {
                    if (period.overlapSingle(otherPeriod)) {
                        overlaps.periods.push(period.overlapSingle(otherPeriod));
                    }
                });
            });

            return overlaps;
        } else {
            throw new Error('periodCollection is not an PeriodCollection object');
        }
    }

    overlap(...periodCollections) {
        let overlap = this;

        periodCollections.forEach(function (collection) {
            overlap = overlap.overlapSingle(collection)
        });

        return overlap;
    }

    boundaries() {
        let start = null;
        let end = null;

        this.periods.forEach(function (period) {
            if (start == null || start > period.start) {
                start = period.start;
            }

            if (end == null || end < period.end) {
                end = period.end;
            }
        });

        if (!start || !end) {
            return null;
        }

        return new Period(start, end);
    }

    gaps() {
        let boundaries = this.boundaries();

        if (!boundaries) {
            return new PeriodCollection();
        }

        console.log("Periods"+typeof this.periods);

        // return boundaries.diff(this.periods);
    }

}

module.exports = {
    Period,
    PeriodCollection
};