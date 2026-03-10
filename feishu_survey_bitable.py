#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
飞书多维表格 API 封装 - 培训调查问卷
"""

import json
import urllib.request
import urllib.error
from typing import Optional, Dict, List

class FeishuBitable:
    """飞书多维表格操作类"""
    
    def __init__(self, app_id: str, app_secret: str):
        self.app_id = app_id
        self.app_secret = app_secret
        self.base_url = "https://open.feishu.cn/open-apis/bitable/v1"
        self.token = None
    
    def get_token(self) -> str:
        """获取 tenant_access_token"""
        if self.token:
            return self.token
        
        url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
        payload = json.dumps({
            "app_id": self.app_id,
            "app_secret": self.app_secret
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode('utf-8'))
        
        if result.get('code') == 0:
            self.token = result.get('tenant_access_token')
            return self.token
        else:
            raise Exception(f"获取 token 失败：{result}")
    
    def _request(self, method: str, path: str, data: Optional[Dict] = None) -> Dict:
        """发送 HTTP 请求"""
        url = f"{self.base_url}{path}"
        token = self.get_token()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        body = json.dumps(data).encode('utf-8') if data else None
        
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                result = json.loads(response.read().decode('utf-8'))
            return result
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8') if e.fp else ''
            raise Exception(f"HTTP {e.code}: {e.reason} - {error_body}")
    
    def create_app(self, title: str) -> Dict:
        """创建多维表格"""
        result = self._request('POST', '/apps', {'title': title})
        return result.get('data', {})
    
    def get_app(self, app_token: str) -> Dict:
        """获取多维表格信息"""
        result = self._request('GET', f'/apps/{app_token}')
        return result.get('data', {})
    
    def list_tables(self, app_token: str) -> List[Dict]:
        """获取表格列表"""
        result = self._request('GET', f'/apps/{app_token}/tables')
        return result.get('data', {}).get('items', [])
    
    def create_record(self, app_token: str, table_id: str, fields: Dict) -> Dict:
        """添加记录"""
        path = f'/apps/{app_token}/tables/{table_id}/records'
        result = self._request('POST', path, {'fields': fields})
        return result.get('data', {})
    
    def list_records(self, app_token: str, table_id: str, page_size: int = 100) -> List[Dict]:
        """获取记录列表"""
        path = f'/apps/{app_token}/tables/{table_id}/records?page_size={page_size}'
        result = self._request('GET', path)
        return result.get('data', {}).get('items', [])


def create_survey_bitable(client: FeishuBitable) -> Dict:
    """创建调查问卷多维表格"""
    print("📋 创建培训调查问卷多维表格...")
    
    # 创建多维表格
    app = client.create_app("培训调查问卷")
    app_token = app.get('app', {}).get('app_token')
    print(f"✅ 创建成功：{app_token}")
    print(f"   访问 URL: https://baijiubg.feishu.cn/base/{app_token}")
    
    # 获取默认表格
    tables = client.list_tables(app_token)
    table_id = tables[0]['table_id'] if tables else None
    print(f"✅ 默认表格 ID: {table_id}")
    
    return {
        'app_token': app_token,
        'table_id': table_id,
        'url': f"https://baijiubg.feishu.cn/base/{app_token}"
    }


if __name__ == '__main__':
    # 配置
    APP_ID = "cli_a90981de3c78dcc8"
    APP_SECRET = "RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq"
    
    # 创建客户端
    client = FeishuBitable(APP_ID, APP_SECRET)
    
    # 创建调查问卷
    survey_info = create_survey_bitable(client)
    
    print("\n" + "="*60)
    print("✅ 调查问卷创建完成！")
    print("="*60)
    print(f"\n多维表格链接：{survey_info['url']}")
    print(f"\n📝 下一步：")
    print("1. 在飞书中打开上述链接")
    print("2. 添加问卷所需的字段（姓名、部门、满意度等）")
    print("3. 可以通过 API 或手动方式添加问卷数据")
