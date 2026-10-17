import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) throw new Error('GH_TOKEN missing');

const OWNER = 'tangzixi0724';
const REPO = 'tzixi_web';
const API = 'https://api.github.com';
const DIR = 'C:/Users/Administrator/AppData/Local/Temp/mcmods';

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

const releases = [
  {
    tag: 'glb2lt',
    name: 'GLB 转小方块 1.31.0',
    body: [
      '把 glTF / GLB 模型导入 Minecraft，转换成一格一格真实的 LittleTiles 体素。',
      '',
      '**依赖**：LittleTiles 1.6.0+、CreativeCore 2.12.30+',
      '**加载器**：Forge（仅 1.20.1）',
      '',
      '用法：游戏内输入 `/glb2lt`，模型从游戏目录下的 `glb2lt` 文件夹读取。',
    ].join('\n'),
    files: ['glb2lt-1.31.0_1.20.1.jar'],
  },
  {
    tag: 'cinematic-bars',
    name: '电影挡条 1.0.0',
    body: [
      '按住一个键，画面上下压出电影黑边。不依赖光影，所有整合包通用。',
      '',
      '**依赖**：Fabric API；可选 YACL + Mod Menu（图形化设置界面）',
      '**加载器**：Fabric，纯客户端',
      '',
      '| 文件 | Minecraft |',
      '| --- | --- |',
      '| `cinematic-bars-1.0.0_26.3.jar` | 26.3 |',
      '| `cinematic-bars-1.0.0_1.21.10.jar` | 1.21.10 |',
      '',
      '两个构建互相独立，装错版本游戏会起不来。',
    ].join('\n'),
    files: ['cinematic-bars-1.0.0_26.3.jar', 'cinematic-bars-1.0.0_1.21.10.jar'],
  },
  {
    tag: 'better-falling-leaves',
    name: '落叶纷飞 1.0.0',
    body: [
      'BetterFoliage 落叶粒子效果的独立移植版：叶片会旋转、顺着全局风飘、落地后停住。',
      '',
      '**依赖**：Fabric API、Java 25；可选 YACL（游戏内设置界面）',
      '**加载器**：Fabric 26.3，纯客户端',
      '',
      '支持自然风廓线 u(z) = u10 × (z/10)^α，地表粗糙度可从开阔水面 0.12 调到密集城市 0.30。',
    ].join('\n'),
    files: ['better-falling-leaves-1.0.0_26.3.jar'],
  },
];

async function createRelease({ tag, name, body }) {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/releases`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tag_name: tag,
      name,
      body,
      draft: false,
      prerelease: false,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    // 已存在就复用
    if (data.errors?.some((e) => String(e.code).includes('already_exists')) || data.message?.includes('already_exists')) {
      const existing = await fetch(`${API}/repos/${OWNER}/${REPO}/releases/tags/${tag}`, { headers });
      if (existing.ok) {
        const rel = await existing.json();
        console.log(`  [已存在] ${tag} (id ${rel.id})`);
        return rel;
      }
    }
    throw new Error(`建 Release ${tag} 失败: ${res.status} ${JSON.stringify(data)}`);
  }
  console.log(`  [新建] ${tag} (id ${data.id})`);
  return data;
}

async function uploadAsset(release, fileName) {
  const path = `${DIR}/${fileName}`;
  const size = statSync(path).size;
  const content = readFileSync(path);

  const res = await fetch(
    `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(fileName)}`,
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/java-archive',
        'Content-Length': String(size),
      },
      body: content,
    },
  );
  const data = await res.json();
  if (!res.ok) {
    if (data.message?.includes('already_exists')) {
      console.log(`  [跳过] ${fileName} 已存在`);
      return data;
    }
    throw new Error(`上传 ${fileName} 失败: ${res.status} ${JSON.stringify(data)}`);
  }
  console.log(`  [上传] ${fileName}  ${(data.size / 1024).toFixed(0)} KB  ${data.browser_download_url}`);
  return data;
}

const results = [];
for (const rel of releases) {
  console.log(`\n== ${rel.name}`);
  const created = await createRelease(rel);
  for (const file of rel.files) {
    const asset = await uploadAsset(created, file);
    results.push({ tag: rel.tag, file, url: asset.browser_download_url, size: asset.size });
  }
}

console.log('\n=== 全部完成 ===');
console.log(JSON.stringify(results, null, 2));
