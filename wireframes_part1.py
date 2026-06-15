<!DOCTYPE html><html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>校园通 - 低保真原型</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Inter","PingFang SC","Microsoft YaHei",sans-serif; background: #e8e8e8; color: #333; }
/* sticky top nav */
.screen-nav { position: sticky; top: 0; z-index: 100; background: #2563EB; display: flex; overflow-x: auto; padding: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.screen-nav a { display: block; padding: 12px 20px; color: rgba(255,255,255,0.75); text-decoration: none; font-size: 13px; font-weight: 500; white-space: nowrap; border-bottom: 2px solid transparent; transition: all .15s; }
.screen-nav a:hover, .screen-nav a.active { color: #fff; border-bottom-color: #fff; background: rgba(255,255,255,0.1); }
/* banner */
.note-banner { background: #FEF3C7; border: 1px solid #FDE68A; color: #92400E; text-align: center; padding: 10px 24px; font-size: 13px; max-width: 800px; margin: 0 auto; border-radius: 0 0 8px 8px; }
/* screen card */
.screen-card { background: #fff; margin: 24px auto; max-width: 800px; border-radius: 10px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden; }
.header-bar { background: #2563EB; color: #fff; padding: 12px 24px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; }
.prototype-container { max-width: 780px; margin: 0 auto; background: #f5f5f5; position: relative; }
.screen-label { text-align: center; padding: 16px 24px 8px; font-size: 11px; color: #999; letter-spacing: 1px; text-transform: uppercase; }
/* Wireframe Styles */
.wf-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: #fff; border-bottom: 1px solid #eee; }
.wf-bar-title { font-size: 16px; font-weight: 600; }
.wf-bar-action { font-size: 13px; color: #2563EB; }
.wf-tabs { display: flex; background: #fff; border-bottom: 1px solid #eee; overflow-x: auto; }
.wf-tab { padding: 10px 24px; font-size: 13px; white-space: nowrap; border-bottom: 2px solid transparent; cursor: default; }
.wf-tab.active { border-bottom-color: #2563EB; color: #2563EB; font-weight: 600; }
.wf-feed { padding: 12px 24px; }
.wf-card { background: #fff; border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid #eee; display: flex; gap: 12px; }
.wf-card-tag { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; margin-bottom: 6px; }
.wf-card-tag.career { background: #DBEAFE; color: #2563EB; }
.wf-card-tag.rental { background: #DCFCE7; color: #16A34A; }
.wf-card-tag.secondhand { background: #FEE2E2; color: #DC2626; }
.wf-card-tag.life { background: #FEF3C7; color: #D97706; }
.wf-card-body { flex: 1; }
.wf-card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; line-height: 1.4; }
.wf-card-desc { font-size: 12px; color: #888; margin-bottom: 4px; }
.wf-card-time { font-size: 11px; color: #bbb; }
.wf-card-thumb { width: 72px; height: 72px; background: #e5e5e5; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #aaa; }
.wf-bottom-nav { display: flex; background: #fff; border-top: 1px solid #eee; }
.wf-nav-item { flex: 1; text-align: center; padding: 8px 0; font-size: 10px; color: #999; }
.wf-nav-item.active { color: #2563EB; }
.wf-nav-item .icon { font-size: 18px; display: block; margin-bottom: 2px; }
.wf-nav-item.plus .icon { width: 40px; height: 40px; background: #2563EB; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; margin: -16px auto 2px; font-size: 20px; }
.wf-search { margin: 12px 24px; background: #f0f0f0; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #aaa; }
.wf-list-item { background: #fff; padding: 16px 24px; border-bottom: 1px solid #f0f0f0; }
.wf-list-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.wf-list-meta { font-size: 12px; color: #888; margin-bottom: 2px; }
.wf-list-time { font-size: 11px; color: #bbb; }
.wf-detail-header { background: #e5e5e5; height: 200px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #aaa; }
.wf-detail-body { padding: 20px 24px; }
.wf-detail-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.wf-detail-price { font-size: 22px; font-weight: 700; color: #DC2626; margin-bottom: 12px; }
.wf-detail-desc { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 16px; }
.wf-detail-author { background: #f9f9f9; border-radius: 8px; padding: 14px; display: flex; align-items: center; gap: 10px; }
.wf-author-avatar { width: 44px; height: 44px; background: #ddd; border-radius: 50%; flex-shrink: 0; }
.wf-author-info { font-size: 13px; }
.wf-author-badge { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; background: #DCFCE7; color: #16A34A; margin-top: 2px; }
.wf-bottom-action { display: flex; background: #fff; border-top: 1px solid #eee; padding: 12px 24px; gap: 12px; }
.wf-btn { flex: 1; height: 44px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: default; }
.wf-btn.outline { background: #fff; border: 1px solid #ddd; color: #333; }
.wf-btn.primary { background: #2563EB; color: #fff; }
.wf-form { padding: 16px 24px; }
.wf-form-label { font-size: 13px; font-weight: 600; margin: 16px 0 6px; }
.wf-form-label:first-child { margin-top: 0; }
.wf-form-input { width: 100%; height: 44px; border: 1px solid #ddd; border-radius: 8px; padding: 0 12px; font-size: 14px; background: #fff; }
.wf-form-textarea { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 12px; font-size: 14px; background: #fff; min-height: 80px; resize: none; }
.wf-form-photos { display: flex; gap: 8px; }
.wf-form-photo { width: 80px; height: 80px; background: #f0f0f0; border: 1px dashed #ccc; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #bbb; }
.wf-stars { font-size: 28px; color: #F59E0B; letter-spacing: 4px; }
.wf-stars .empty { color: #ddd; }
.wf-profile-header { text-align: center; padding: 32px 24px 20px; background: #fff; }
.wf-avatar-lg { width: 80px; height: 80px; background: #ddd; border-radius: 50%; margin: 0 auto 12px; }
.wf-profile-name { font-size: 18px; font-weight: 600; }
.wf-profile-school { font-size: 13px; color: #888; margin-top: 2px; }
.wf-stats { display: flex; margin-top: 16px; }
.wf-stat { flex: 1; text-align: center; }
.wf-stat-num { font-size: 20px; font-weight: 700; }
.wf-stat-label { font-size: 11px; color: #888; }
.wf-modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: flex-end; }
.wf-modal { background: #fff; border-radius: 12px 12px 0 0; padding: 20px 24px 32px; width: 100%; }
.wf-modal-title { font-size: 16px; font-weight: 600; text-align: center; margin-bottom: 16px; }
.wf-modal-option { padding: 14px; border-bottom: 1px solid #f0f0f0; font-size: 15px; }
</style>
</head>
<body>

<div class="screen-nav">
  <a href="#s-home" class="active">首页</a>
  <a href="#s-career">校招列表</a>
  <a href="#s-detail">详情页</a>
  <a href="#s-publish">发布美食</a>
  <a href="#s-modal">发布模块选择</a>
  <a href="#s-profile">个人主页</a>
</div>

<div class="note-banner">🏫 校园通 · 低保真原型 — 共 6 个屏幕，点击上方标签快速跳转</div>
