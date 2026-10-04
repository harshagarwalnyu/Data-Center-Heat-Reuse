from heatreuse import verify


def test_verify_has_no_fail():
    checks, rows = verify.run()
    fails = [c for c in checks if c[0] == "FAIL"]
    assert not fails, fails
    assert len(rows) > 100


def test_register_rows_complete():
    _, rows = verify.run(write=False)
    for r in rows:
        assert set(r) == {"input", "value", "unit", "source", "confidence"}
        assert r["confidence"] in {"sourced", "assumption", "unverified"}
        assert r["source"]
