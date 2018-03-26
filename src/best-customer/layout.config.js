export default {
  key: '10000',
  type: 'SectionContainer',
  items: [{
    key: 'slicer',
    output: '@time',
    type: 'TimeRange',
    props: {
      label: 'Time Range',
    },
  }, {
    key: 'bestUser',
    type: 'SectionCard',
    props: {
      title: 'Best User',
    },
    items: [{
      key: 'measureUser',
      input: 'measureUser',
      output: '@measureUser',
      type: 'SingleSelector',
      props: {
        label: 'Measure',
      },
    }, {
      key: 'bestUser',
      input: 'bestUser',
      type: 'PlainData',
      props: {
        title: 'Best User SectionCard',
      },
    }],
  }, {
    key: 'bestCustomer',
    type: 'SectionCard',
    props: {
      title: 'Best Customer Overview',
    },
    items: [{
      key: 'measureCustomer',
      input: 'measureCustomer',
      output: '@measureCustomer',
      type: 'SingleSelector',
      props: {
        label: 'Measure',
      },
    }, {
      key: 'bestCustomerQuery',
      input: 'bestCustomerQuery',
      type: 'PlainData',
      props: {
        title: 'Best Customer Query',
      },
    }, {
      key: 'bestCustomerTSAD',
      input: 'bestCustomerTSAD',
      type: 'LineWithDataZoom',
      props: {
        title: 'Best Customer TSAD',
      },
    }],
  }, {
    key: 'bestCustomerExpensePerUser',
    type: 'SectionCard',
    props: {
      title: 'Best Customer Overview',
    },
    items: [{
      key: 'granularityCustomer',
      input: 'granularityCustomer',
      output: '@granularityCustomer',
      type: 'SingleSelector',
      props: {
        label: 'Granularity',
      },
    }, {
      key: 'customerExpensePerUserBucket',
      input: 'customerExpensePerUserBucket',
      type: 'Bar',
      props: {
        title: 'Best Customer Expense Per User Bucket',
      },
    }, {
      key: 'customerExpensePerUserRank',
      input: 'customerExpensePerUserRank',
      type: 'HorizontalBar',
      props: {
        title: 'Best Customer Expense Per User TSAD',
      },
    }],
  }, {
    key: 'favor',
    type: 'SectionCard',
    props: {
      title: 'Favor XXX of Best Customers',
    },
    items: [{
      key: 'measureFavor',
      input: 'measureFavor',
      output: '@measureFavor',
      type: 'SingleSelector',
      props: {
        label: 'Measure',
      },
    }, {
      key: 'dimensionFavor',
      input: 'dimensionFavor',
      output: '@dimensionFavor',
      type: 'SingleSelector',
      props: {
        label: 'Dimension',
      },
    }, {
      key: 'favorBestCustomerReduce',
      input: 'favorBestCustomerReduce',
      type: 'Donut',
      props: {
        title: 'Favor Best Customer Reduce',
      },
    }, {
      key: 'favorBestCustomerTrend',
      input: 'favorBestCustomerTrend',
      type: 'LineWithDataZoom',
      props: {
        title: 'Favor Customer Trend',
      },
    }],
  }, {
    key: 'mealCard',
    type: 'SectionCard',
    props: {
      title: 'Usage of Meal SectionCard',
    },
    items: [{
      key: 'usageMealCardReduce',
      input: 'usageMealCardReduce',
      type: 'Donut',
      props: {
        subTitle: 'Usage of Meal SectionCard Reduce',
      },
    }, {
      key: 'usageMealCardBucketCRAP',
      input: 'usageMealCardBucketCRAP',
      type: 'Bar',
      props: {
        title: 'Usage of Meal SectionCard Bucket CardRechargeAmountPerUU',
      },
    }, {
      key: 'usageMealCardQuery',
      input: 'usageMealCardQuery',
      type: 'PlainData',
      props: {
        title: 'Usage of Meal SectionCard Query',
      },
    }, {
      key: 'usageMealCardBucketCB',
      input: 'usageMealCardBucketCB',
      type: 'PlainData',
      props: {
        title: 'Usage of Meal SectionCard CardBalance',
      },
    }],
  }, {
    key: 'growthAbility',
    type: 'SectionCard',
    props: {
      title: 'Growth Ability',
    },
    items: [{
      key: 'measureGrowth',
      input: 'measureGrowth',
      output: '@measureGrowth',
      type: 'SingleSelector',
      props: {
        label: 'Measure',
      },
    }, {
      key: 'growthAbilityCumulative',
      input: 'growthAbilityCumulative',
      type: 'LineWithDataZoom',
      props: {
        subTitle: 'Growth Ability Cumulative',
      },
    }, {
      key: 'growthAbilityGrowthRate',
      input: 'growthAbilityGrowthRate',
      type: 'LineWithDataZoom',
      props: {
        title: 'Growth Ability Growth Rate',
      },
    }],
  }],
};
