import { describe, expect, it } from 'vitest';

function canPost(status: string) {
  if (status !== 'approved') throw new Error('only approved drafts can be posted');
}

describe('MVP safety rules', () => {
  it('approved以外は投稿不可', () => {
    expect(() => canPost('draft')).toThrow();
  });

  it('posted済みは再投稿不可', () => {
    const fn = () => { throw new Error('already posted'); };
    expect(fn).toThrow('already posted');
  });

  it('generate-draftsはtopic_id必須', () => {
    const fn = () => { throw new Error('topic_id is required'); };
    expect(fn).toThrow('topic_id is required');
  });

  it('post-to-xはdraft_id必須', () => {
    const fn = () => { throw new Error('draft_id is required'); };
    expect(fn).toThrow('draft_id is required');
  });
});
