const combinedData = perdata.map(person => {
  const employee = empdata.find(emp => emp.id === person.id);
  if (employee) {
    return { id: person.id, name: person.name, company: employee.company, dep: employee.dep };
  }
  return person;
});
