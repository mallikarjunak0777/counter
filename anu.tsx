const asdMap = new Map(asd.map((item) => [item.a, item]));

    // Create a new array for updated 'asd'
    const updatedAsd = asd.map((item) => {
      const matchingBnm = bnm.find((bnmItem) => bnmItem.a === item.a);
      if (matchingBnm) {
        return { ...item, d: matchingBnm.d };
      }
      return item;
    });

    // Iterate through 'bnm' to add new items to 'updatedAsd'
    bnm.forEach((bnmItem) => {
      if (!asdMap.has(bnmItem.a)) {
        updatedAsd.push(bnmItem);
      }
    });

    // Set the state with the updated 'asd'
    setAsd(updatedAsd);
