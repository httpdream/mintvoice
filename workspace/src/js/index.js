var countOptions = {
  useEasing: true,
  useGrouping: true,
  separator: ',',
  decimal: '.',
};
var sourceCount = new CountUp('sourceCount', 0, 1234567890, 0, 3, countOptions);
var sourceUser = new CountUp('sourceUser', 0, 1234567, 0, 3, countOptions);
if (!sourceCount.error && !sourceUser.error) {
  sourceCount.start();
  sourceUser.start();
} else if(sourceCount.error){
  console.error(sourceCount.error);
}else {
  console.error(sourceUser.error);
}
