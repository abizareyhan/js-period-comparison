/**
 *
 * @author Muhammad Reyhan Abizar
 * @version 0.1.0
 * @since 11/29/2018
 */

const Period = require('../period-compare').Period;
const PeriodCollection = require('../period-compare').PeriodCollection;
const assert = require('assert');
const moment = require('moment');

describe('Period Functional Positive Test', function() {
    it('Can return Period from given start and end date', function() {
        let period = new Period('01/01/2018', '01/31/2018');

        assert(period instanceof Period);
    });

    it('Can determine start date of period', function(){
        let period = new Period('01/01/2018', '01/31/2018');
        let start = moment('01/01/2018', "MM/DD/YYYY");

        assert(period.start.isSame(start));
    });

    it('Can determine end date of period', function(){
        let period = new Period('01/01/2018', '01/31/2018');
        let end = moment('01/31/2018', "MM/DD/YYYY");

        assert(period.end.isSame(end));
    });

    it('Can determine the period length', function(){
        let period = new Period('01/01/2018', '01/31/2018');

        assert.equal(period.length(), 31);
    });

    it('Can determine if two periods overlap with each other', function(){
        let periodOne = new Period('01/01/2018', '01/31/2018');
        let periodTwo = new Period('01/16/2018', '01/31/2018');

        assert(periodOne.overlapWith(periodTwo));
    });

    it('Can determine if two periods is equals', function(){
        let period = new Period('01/01/2018', '01/31/2018');
        let anotherSamePeriod = new Period('01/01/2018', '01/31/2018');

        assert(period.equals(anotherSamePeriod));
    });

    it('Can determine two periods touch each other', function(){
        let periodOne = new Period('01/01/2018', '01/15/2018');
        let periodTwo = new Period('01/16/2018', '01/31/2018');

        assert(periodOne.touchesWith(periodTwo));
    });

    it('Can determine period start after date', function(){
        let periodOne = new Period('01/15/2018', '01/19/2018');
        let date = '01/13/2018';

        assert(periodOne.startAfter(date));
    });

    it('Can determine period start before date', function(){
        let periodOne = new Period('01/15/2018', '01/19/2018');
        let date = '01/21/2018';

        assert(periodOne.startBefore(date));
    });

    it('Can determine period end after date', function(){
        let periodOne = new Period('01/15/2018', '01/19/2018');
        let date = '01/17/2018';

        assert(periodOne.endAfter(date));
    });

    it('Can determine period end before date', function(){
        let periodOne = new Period('01/15/2018', '01/19/2018');
        let date = '01/21/2018';

        assert(periodOne.endBefore(date));
    });

    it('Can determine gap between two periods', function(){
        let periodOne = new Period('01/15/2018', '01/19/2018');
        let periodTwo = new Period('01/21/2018', '01/23/2018');
        let gap = new Period('01/20/2018', '01/20/2018');

        assert(periodOne.gap(periodTwo).equals(gap));
    });

    it('Can determine overlap with other periods', function(){
        let periodOne = new Period('01/01/2018', '01/31/2018');
        let periodTwo = new Period('02/10/2018', '02/20/2018');
        let periodThree = new Period('03/01/2018', '03/31/2018');
        let longPeriod = new Period('01/20/2018', '03/10/2018');

        let overlapPeriods = longPeriod.overlap(periodOne, periodTwo, periodThree);

        assert.equal(overlapPeriods.count(), 3);
        assert(overlapPeriods.get(0).equals(new Period('01/20/2018', '01/31/2018')));
        assert(overlapPeriods.get(1).equals(new Period('02/10/2018', '02/20/2018')));
        assert(overlapPeriods.get(2).equals(new Period('03/01/2018', '03/10/2018')));
    });

    it('Can determine overlap with all periods', function(){
        let periodOne = new Period('01/01/2018', '01/31/2018');
        let periodTwo = new Period('01/10/2018', '01/15/2018');
        let periodThree = new Period('01/10/2018', '01/31/2018');

        let overlap = periodOne.overlapAll(periodTwo, periodThree);

        assert(overlap.equals(new Period('01/10/2018', '01/15/2018')));
    });

    it('Can determine diff for two periods', function(){
        let periodOne = new Period('01/01/2018', '01/15/2018');
        let periodTwo = new Period('01/10/2018', '01/30/2018');

        let diff = periodOne.diffSingle(periodTwo);

        assert(diff.get(0).equals(new Period('01/01/2018', '01/09/2018')));
        assert(diff.get(1).equals(new Period('01/16/2018', '01/30/2018')));
    });

});

describe('PeriodCollection Functional Positive Test', function() {
   it('Can return PeriodCollection from given Period', function(){
       let periodCollection = new PeriodCollection(
           new Period('01/01/2018', '01/05/2018'),
           new Period('01/10/2018', '01/15/2018'),
           new Period('01/20/2018', '01/25/2018'),
           new Period('01/30/2018', '01/31/2018')
       );

       assert(periodCollection instanceof PeriodCollection);
   });

    it('Can return Period of given index', function(){
        let periodCollection = new PeriodCollection(
            new Period('01/01/2018', '01/05/2018'),
            new Period('01/10/2018', '01/15/2018'),
            new Period('01/20/2018', '01/25/2018'),
            new Period('01/30/2018', '01/31/2018')
        );

        assert(periodCollection.get(0) instanceof Period);
        assert(periodCollection.get(1) instanceof Period);
        assert(periodCollection.get(2) instanceof Period);
        assert(periodCollection.get(3) instanceof Period);
    });

    it('Can return length of Collection', function(){
        let periodCollection = new PeriodCollection(
            new Period('01/01/2018', '01/05/2018'),
            new Period('01/10/2018', '01/15/2018'),
            new Period('01/20/2018', '01/25/2018'),
            new Period('01/30/2018', '01/31/2018')
        );

        assert.equal(periodCollection.count(), 4);
    });

    it('Can add period from current collection', function(){
        let periodCollection = new PeriodCollection(
            new Period('01/01/2018', '01/05/2018'),
            new Period('01/10/2018', '01/15/2018'),
            new Period('01/20/2018', '01/25/2018')
        );

        periodCollection.addPeriod(new Period('01/30/2018', '01/31/2018'));

        assert(periodCollection.get(3).equals(new Period('01/30/2018', '01/31/2018')))
    });

    it('Can determine multiple overlaps for single collection', function(){
        let collectionOne = new PeriodCollection(
            new Period('01/05/2018', '01/10/2018'),
            new Period('01/20/2018', '01/25/2018')
        );

        let collectionTwo = new PeriodCollection(
            new Period('01/01/2018', '01/15/2018'),
            new Period('01/22/2018', '01/30/2018')
        );

        let overlapPeriods = collectionOne.overlapSingle(collectionTwo);

        assert.equal(overlapPeriods.count(), 2);
        assert(overlapPeriods.get(0).equals(new Period('01/05/2018', '01/10/2018')));
        assert(overlapPeriods.get(1).equals(new Period('01/22/2018', '01/25/2018')));
    });

    it('Can determine multiple overlaps for multiple collection', function(){
        let collectionOne = new PeriodCollection(
            new Period('01/01/2018', '01/07/2018'),
            new Period('01/15/2018', '01/25/2018')
        );

        let collectionTwo = new PeriodCollection(
            new Period('01/01/2018', '01/20/2018')
        );

        let collectionThree = new PeriodCollection(
            new Period('01/06/2018', '01/25/2018')
        );

        let overlapPeriods = collectionOne.overlap(collectionTwo, collectionThree);

        assert.equal(overlapPeriods.count(), 2);
        assert(overlapPeriods.get(0).equals(new Period('01/06/2018', '01/07/2018')));
        assert(overlapPeriods.get(1).equals(new Period('01/15/2018', '01/20/2018')));
    });

    it('Can determine boundaries of collection', function(){
        let collection = new PeriodCollection(
            new Period('01/01/2018', '01/05/2018'),
            new Period('01/10/2018', '01/15/2018'),
            new Period('01/20/2018', '01/25/2018'),
            new Period('01/30/2018', '01/31/2018'),
        );

        let boudaries = collection.boundaries();

        assert(boudaries.equals(new Period('01/01/2018', '01/31/2018')));
    });

    it('Can determine gaps of a collection', function(){
       let collection = new PeriodCollection(
           new Period('01/01/2018', '01/05/2018'),
           new Period('01/10/2018', '01/15/2018'),
           new Period('01/20/2018', '01/25/2018'),
           new Period('01/30/2018', '01/31/2018'),
       );

       let gaps = collection.gaps();

       assert.equal(gaps.count(), 3);
    });

});