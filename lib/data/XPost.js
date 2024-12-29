class XPost {
  constructor(id, user_id, full_text, created_at, stored_at, collect_hdr_id, url) {
    this.id = id;
    this.user_id = user_id;
    this.full_text = full_text;
    this.created_at = created_at;
    this.stored_at = stored_at;
    this.collect_hdr_id = collect_hdr_id;
    this.url = url;
  }
}

module.exports = {XPost};