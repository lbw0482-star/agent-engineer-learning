import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
})

const INDEX_NAME = 'travel_journal';

async function  createDocument() {
  const now = new Date().toISOString();
  const res = await client.index({
    index: INDEX_NAME,
    document: {
      note_title: '夜跑复盘',
      note_body: '今天夜跑5公里， 配速稳定， 结束后做了拉伸。',
      tags: ['运动', '夜跑'],
      mod: 'focused',
      priority: 2, 
      created_at: now,
      updated_at: now
    }
  });
  console.log(`新增 成功，ID=`, res._id);
  return res._id;
}
async function getDocument(docId) {
  const res = await client.get({
    index: INDEX_NAME,
    id: docId
  });
  console.log('查询结果', res._source);
}
async function updateDocument(docId) {
  await client.update({
    index: INDEX_NAME,
    id: docId,
    doc: {
      note_body: '今天夜跑6公里， 状态不错， 拉伸后恢复很快。',
      tags: ['运动', '夜跑', '训练'],
      updated_at: new Date().toISOString()
    },
    refresh: true
  });
  console.log('更新成功')
}

async function searchDocument() {
  const res = await client.search({
    index: INDEX_NAME,
    query: {
      match: {
        note_body: {
          query: '夜跑',
          analyzer: 'ik_smart'
        }
      }
    }
  })
  console.log(res);
  const rows = res.hits.hits.map((item) => ({
    id: item._id,
    ...item._source
  }))
  console.log(rows);
}

async function main() {
  // const docId = await createDocument();
  // const docId = 'Oz_fvaABLbHZogOmxAHd'
  // console.log(docId);
  // await getDocument(docId);
  await searchDocument();
  // await updateDocument(docId);
}
main()
  .catch(console.error);