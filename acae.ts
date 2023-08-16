Map<String, Integer> sumByGroupName = beans.stream()
                .collect(Collectors.groupingBy(Bean::getName,
                        Collectors.summingInt(bean -> Integer.parseInt(bean.getAmount()))));

        List<Bean> resultList = beans.stream()
                .collect(Collectors.groupingBy(bean -> bean.getName(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                beanList -> {
                                    String ogcId = beanList.stream()
                                            .filter(bean -> !bean.getOgc().isEmpty())
                                            .findFirst()
                                            .map(Bean::getOgc)
                                            .orElse("");
                                    String smallestId = beanList.stream()
                                            .map(bean -> Integer.parseInt(bean.getId()))
                                            .min(Integer::compare)
                                            .map(String::valueOf)
                                            .orElse("");

                                    return new Bean(String.valueOf(sumByGroupName.get(beanList.get(0).getName())),
                                            beanList.get(0).getName(),
                                            ogcId.isEmpty() ? smallestId : beanList.stream()
                                                    .filter(bean -> bean.getOgc().equals(ogcId))
                                                    .findFirst()
                                                    .map(Bean::getId)
                                                    .orElse(smallestId),
                                            ogcId);
                                }
                        )
                ))
                .values().stream()
                .collect(Collectors.toList());
