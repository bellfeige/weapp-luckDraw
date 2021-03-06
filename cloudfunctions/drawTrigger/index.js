const cloud = require('wx-server-sdk')
cloud.init({
  // env: 'demo-011111',
  env: 'produce-zam1a',
})
const db = cloud.database()

exports.main = async (event, context) => {
  const execTasks = []; // 待执行任务栈
  // 1.查询是否有定时任务。（timeingTask)集合是否有数据。
  let taskRes = await db.collection('giftList').where({
    drawStatus: false
  })
    .limit(100)
    .orderBy('createDate', 'desc').get()
  let tasks = taskRes.data;


  // 2.定时任务是否到达触发时间。只触发一次。
  let now = new Date();
  try {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].execTime <= now) { // 时间到
        execTasks.push(tasks[i]); // 存入待执行任务栈

        // 定时任务数据库中删除该任务
        // await db.collection('giftList').doc(tasks[i]._id).remove()
      }
    }
  } catch (e) {
    console.error(e)
  }


  // 3.处理待执行任务
  for (let i = 0; i < execTasks.length; i++) {
    let task = execTasks[i];

    if (!task.drawStatus) {
      try {
        await cloud.callFunction({
          name: 'drawWinner',
          data: {
            db: 'giftList',
            _id: task._id,
            participators: task.participators,
            title: task.title,
          },
        })

      } catch (e) {
        console.error(e)
      }
      // return task._id
    }

  }
  return execTasks

}